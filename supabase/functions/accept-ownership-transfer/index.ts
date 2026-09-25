import {
  withSupabase,
} from "npm:@supabase/server@^1";


// =========================================================
// ERROR MESSAGE
// =========================================================

function getErrorMessage(
  error: unknown
) {

  if (
    error instanceof Error
  ) {
    return error.message;
  }


  if (
    typeof error ===
    "string"
  ) {
    return error;
  }


  try {
    return JSON.stringify(
      error
    );
  } catch {
    return String(error);
  }

}


// =========================================================
// ACCEPT OWNERSHIP TRANSFER
// =========================================================

export default {

  fetch: withSupabase(
    {
      auth: "user",
    },

    async (req, ctx) => {

      try {

        const body =
          await req.json();


        const action =
          String(
            body?.action ??
            "preview"
          )
            .trim()
            .toLowerCase();


        const transferId =
          String(
            body?.transfer_id ??
            ""
          )
            .trim();


        if (
          ![
            "preview",
            "accept",
          ].includes(action)
        ) {

          return Response.json(
            {
              error:
                "Invalid ownership transfer action.",
            },
            {
              status: 400,
            }
          );

        }


        if (!transferId) {

          return Response.json(
            {
              error:
                "The ownership transfer ID is missing.",
            },
            {
              status: 400,
            }
          );

        }


        // ===============================================
        // VERIFY AUTHENTICATED REPLACEMENT
        // ===============================================

        const currentUserId =
          ctx.userClaims?.id;


        const currentUserEmail =
          String(
            ctx.userClaims?.email ||
            ""
          )
            .trim()
            .toLowerCase();


        if (
          !currentUserId ||
          !currentUserEmail
        ) {

          return Response.json(
            {
              error:
                "Your authenticated account could not be verified.",
            },
            {
              status: 401,
            }
          );

        }


        // ===============================================
        // LOAD TRANSFER REQUEST
        // ===============================================

        const {
          data: transfer,
          error: transferError,
        } =
          await ctx.supabaseAdmin
            .from(
              "ownership_transfer_requests"
            )
            .select(`
              id,
              client_id,
              requested_by,
              replacement_user_id,
              replacement_name,
              replacement_email,
              previous_owner_access,
              status,
              expires_at,
              accepted_at,
              clients (
                business_name
              )
            `)
            .eq(
              "id",
              transferId
            )
            .maybeSingle();


        if (transferError) {
          throw transferError;
        }


        if (!transfer) {

          return Response.json(
            {
              error:
                "This ownership transfer invitation could not be found.",
            },
            {
              status: 404,
            }
          );

        }


        if (
          transfer.replacement_email !==
          currentUserEmail
        ) {

          return Response.json(
            {
              error:
                "This ownership transfer invitation belongs to a different email address.",
            },
            {
              status: 403,
            }
          );

        }


        if (
          transfer.status ===
          "accepted"
        ) {

          return Response.json(
            {
              error:
                "This ownership transfer has already been accepted.",
            },
            {
              status: 409,
            }
          );

        }


        if (
          transfer.status ===
          "cancelled"
        ) {

          return Response.json(
            {
              error:
                "This ownership transfer was cancelled.",
            },
            {
              status: 409,
            }
          );

        }


        if (
          transfer.status ===
          "expired" ||
          new Date(
            transfer.expires_at
          ).getTime() <=
          Date.now()
        ) {

          if (
            transfer.status ===
            "pending"
          ) {

            await ctx.supabaseAdmin
              .from(
                "ownership_transfer_requests"
              )
              .update({
                status:
                  "expired",

                updated_at:
                  new Date()
                    .toISOString(),
              })
              .eq(
                "id",
                transfer.id
              )
              .eq(
                "status",
                "pending"
              );

          }


          return Response.json(
            {
              error:
                "This ownership transfer invitation has expired.",
            },
            {
              status: 410,
            }
          );

        }


        if (
          transfer.status !==
          "pending"
        ) {

          return Response.json(
            {
              error:
                "This ownership transfer is no longer available.",
            },
            {
              status: 409,
            }
          );

        }


        const businessName =
          transfer.clients
            ?.business_name ||
          "this client account";


        // ===============================================
        // PREVIEW
        // ===============================================

        if (
          action ===
          "preview"
        ) {

          return Response.json({
            success:
              true,

            transfer: {
              id:
                transfer.id,

              business_name:
                businessName,

              replacement_name:
                transfer.replacement_name,

              replacement_email:
                transfer.replacement_email,

              expires_at:
                transfer.expires_at,

              requires_password_setup:
                !transfer
                  .replacement_user_id,
            },
          });

        }


        // ===============================================
        // COMPLETE ATOMIC TRANSFER
        // ===============================================

        const {
          data: result,
          error: completionError,
        } =
          await ctx.supabaseAdmin
            .rpc(
              "complete_ownership_transfer",
              {
                p_transfer_id:
                  transfer.id,

                p_accepting_user_id:
                  currentUserId,

                p_accepting_email:
                  currentUserEmail,
              }
            );


        if (completionError) {

          return Response.json(
            {
              error:
                completionError.message ||
                "The ownership transfer could not be completed.",
            },
            {
              status: 400,
            }
          );

        }


        /*
          Store the supplied owner name as display
          metadata. This is for presentation only,
          never authorization.
        */

        const {
          error: metadataError,
        } =
          await ctx.supabaseAdmin
            .auth
            .admin
            .updateUserById(
              currentUserId,
              {
                user_metadata: {
                  full_name:
                    transfer
                      .replacement_name,
                },
              }
            );


        if (metadataError) {

          console.error(
            "Replacement owner metadata update failed:",
            metadataError
          );

        }


        return Response.json({
          success:
            true,

          message:
            `You are now the account owner for ${businessName}.`,

          transfer:
            result,
        });


      } catch (error) {

        console.error(
          "Ownership transfer acceptance failed:",
          error
        );


        return Response.json(
          {
            error:
              getErrorMessage(
                error
              ),
          },
          {
            status: 500,
          }
        );

      }

    }
  ),

};
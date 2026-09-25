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

    return String(
      error
    );

  }

}


// =========================================================
// MANAGE CLIENT PORTAL ACCESS
// =========================================================

export default {

  fetch: withSupabase(
    {
      auth:
        "user",
    },

    async (
      req,
      ctx
    ) => {

      try {

        const body =
          await req.json();


        const action =
          String(
            body?.action ??
            ""
          )
            .trim()
            .toLowerCase();


        const clientId =
          String(
            body?.client_id ??
            ""
          )
            .trim();


        const targetUserId =
          String(
            body?.target_user_id ??
            ""
          )
            .trim();


        if (
          ![
            "list",
            "deactivate",
          ].includes(
            action
          )
        ) {

          return Response.json(
            {
              error:
                "Invalid client access action.",
            },
            {
              status: 400,
            }
          );

        }


        if (!clientId) {

          return Response.json(
            {
              error:
                "A client company is required.",
            },
            {
              status: 400,
            }
          );

        }


        if (
          action ===
            "deactivate" &&
          !targetUserId
        ) {

          return Response.json(
            {
              error:
                "Select the portal user whose access should be removed.",
            },
            {
              status: 400,
            }
          );

        }


        // ===============================================
        // AUTHENTICATED USER
        // ===============================================

        const currentUserId =
          String(
            ctx.userClaims?.id ||
            ""
          )
            .trim();


        if (!currentUserId) {

          return Response.json(
            {
              error:
                "Your authenticated account could not be identified.",
            },
            {
              status: 401,
            }
          );

        }


        // ===============================================
        // VERIFY CLIENT
        // ===============================================

        const {
          data: clientRecord,
          error: clientError,
        } =
          await ctx.supabaseAdmin
            .from(
              "clients"
            )
            .select(
              "id, business_name, status"
            )
            .eq(
              "id",
              clientId
            )
            .maybeSingle();


        if (clientError) {
          throw clientError;
        }


        if (!clientRecord) {

          return Response.json(
            {
              error:
                "Client company not found.",
            },
            {
              status: 404,
            }
          );

        }


        // ===============================================
        // CHECK ALGORITHM FORGE ADMIN ACCESS
        // ===============================================

        const {
          data: adminRecord,
          error: adminError,
        } =
          await ctx.supabaseAdmin
            .from(
              "admin_users"
            )
            .select(
              "user_id, role"
            )
            .eq(
              "user_id",
              currentUserId
            )
            .maybeSingle();


        if (adminError) {
          throw adminError;
        }


        const isAdmin =
          Boolean(
            adminRecord
          );


        // ===============================================
        // CHECK CLIENT OWNER ACCESS
        // ===============================================

        let isClientOwner =
          false;


        if (!isAdmin) {

          const {
            data: ownerMembership,
            error: ownerMembershipError,
          } =
            await ctx.supabaseAdmin
              .from(
                "client_users"
              )
              .select(
                "user_id, client_id, role, is_active"
              )
              .eq(
                "user_id",
                currentUserId
              )
              .eq(
                "client_id",
                clientId
              )
              .maybeSingle();


          if (
            ownerMembershipError
          ) {
            throw ownerMembershipError;
          }


          isClientOwner =
            Boolean(
              ownerMembership &&
              ownerMembership
                .is_active ===
                true &&
              ownerMembership
                .role ===
                "owner"
            );

        }


        if (
          !isAdmin &&
          !isClientOwner
        ) {

          return Response.json(
            {
              error:
                "Only the account owner or an Algorithm Forge administrator can manage portal access.",
            },
            {
              status: 403,
            }
          );

        }


        // ===============================================
        // LIST PORTAL USERS
        // ===============================================

        if (
          action ===
          "list"
        ) {

          const {
            data: memberships,
            error: membershipsError,
          } =
            await ctx.supabaseAdmin
              .from(
                "client_users"
              )
              .select(
                "user_id, client_id, role, is_active"
              )
              .eq(
                "client_id",
                clientId
              )
              .order(
                "role",
                {
                  ascending:
                    true,
                }
              );


          if (
            membershipsError
          ) {
            throw membershipsError;
          }


          const portalUsers =
            await Promise.all(
              (
                memberships ||
                []
              )
                .map(
                  async (
                    membership: any
                  ) => {

                    const {
                      data: authData,
                      error: authError,
                    } =
                      await ctx.supabaseAdmin
                        .auth
                        .admin
                        .getUserById(
                          membership
                            .user_id
                        );


                    if (authError) {
                      throw authError;
                    }


                    const authUser =
                      authData?.user ||
                      null;


                    const metadata =
                      authUser
                        ?.user_metadata ||
                      {};


                    const contactName =
                      String(
                        metadata
                          .contact_name ||
                        metadata
                          .full_name ||
                        metadata
                          .name ||
                        ""
                      )
                        .trim();


                    return {
                      user_id:
                        membership
                          .user_id,

                      client_id:
                        membership
                          .client_id,

                      contact_name:
                        contactName,

                      email:
                        authUser?.email ||
                        "",

                      portal_role:
                        membership
                          .role,

                      is_active:
                        membership
                          .is_active ===
                        true,

                      email_confirmed_at:
                        authUser
                          ?.email_confirmed_at ||
                        null,

                      last_sign_in_at:
                        authUser
                          ?.last_sign_in_at ||
                        null,
                    };

                  }
                )
            );


          return Response.json({
            success:
              true,

            client: {
              id:
                clientRecord.id,

              business_name:
                clientRecord
                  .business_name,
            },

            users:
              portalUsers,
          });

        }


        // ===============================================
        // VERIFY TARGET MEMBERSHIP
        // ===============================================

        const {
          data: targetMembership,
          error: targetMembershipError,
        } =
          await ctx.supabaseAdmin
            .from(
              "client_users"
            )
            .select(
              "user_id, client_id, role, is_active"
            )
            .eq(
              "user_id",
              targetUserId
            )
            .eq(
              "client_id",
              clientId
            )
            .maybeSingle();


        if (
          targetMembershipError
        ) {
          throw targetMembershipError;
        }


        if (!targetMembership) {

          return Response.json(
            {
              error:
                "That portal user is not connected to this client company.",
            },
            {
              status: 404,
            }
          );

        }


        // ===============================================
        // PROTECT OWNER AND CURRENT USER
        // ===============================================

        if (
          targetMembership.role ===
          "owner"
        ) {

          return Response.json(
            {
              error:
                "The account owner's access cannot be removed. Transfer ownership first.",
            },
            {
              status: 409,
            }
          );

        }


        if (
          targetUserId ===
          currentUserId
        ) {

          return Response.json(
            {
              error:
                "You cannot remove your own portal access.",
            },
            {
              status: 409,
            }
          );

        }


        if (
          targetMembership
            .is_active !==
          true
        ) {

          return Response.json({
            success:
              true,

            message:
              "This portal user's access is already inactive.",
          });

        }


        // ===============================================
        // DEACTIVATE PORTAL ACCESS
        // ===============================================

        const {
          data: updatedMembership,
          error: updateError,
        } =
          await ctx.supabaseAdmin
            .from(
              "client_users"
            )
            .update({
              is_active:
                false,
            })
            .eq(
              "user_id",
              targetUserId
            )
            .eq(
              "client_id",
              clientId
            )
            .neq(
              "role",
              "owner"
            )
            .select(
              "user_id, client_id, role, is_active"
            )
            .maybeSingle();


        if (updateError) {
          throw updateError;
        }


        if (!updatedMembership) {

          return Response.json(
            {
              error:
                "Portal access could not be removed.",
            },
            {
              status: 409,
            }
          );

        }


        return Response.json({
          success:
            true,

          message:
            "Portal access has been removed.",

          user: {
            user_id:
              updatedMembership
                .user_id,

            portal_role:
              updatedMembership
                .role,

            is_active:
              updatedMembership
                .is_active,
          },
        });


      } catch (error) {

        console.error(
          "Client access management failed:",
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
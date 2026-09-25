import {
  withSupabase,
} from "npm:@supabase/server@^1";


// =========================================================
// FIND AUTH USER BY EMAIL
// =========================================================

async function findAuthUserByEmail(
  supabaseAdmin: any,
  email: string
) {

  const perPage = 1000;
  let page = 1;


  while (true) {

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .auth
        .admin
        .listUsers({
          page,
          perPage,
        });


    if (error) {
      throw error;
    }


    const users =
      Array.isArray(data?.users)
        ? data.users
        : [];


    const matchingUser =
      users.find(
        (user: any) =>
          String(user?.email || "")
            .trim()
            .toLowerCase() ===
          email
      );


    if (matchingUser) {
      return matchingUser;
    }


    if (
      users.length <
      perPage
    ) {
      return null;
    }


    page += 1;

  }

}


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
// REQUEST OWNERSHIP TRANSFER
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


        const replacementName =
          String(
            body?.replacement_name ??
            ""
          )
            .trim();


        const replacementEmail =
          String(
            body?.replacement_email ??
            ""
          )
            .trim()
            .toLowerCase();


        const previousOwnerAccess =
          String(
            body
              ?.previous_owner_access ??
            "member"
          )
            .trim()
            .toLowerCase();


        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        // ===============================================
        // VALIDATE REQUEST
        // ===============================================

        if (
          replacementName.length <
          2
        ) {

          return Response.json(
            {
              error:
                "Enter the new owner's full name.",
            },
            {
              status: 400,
            }
          );

        }


        if (
          !emailPattern.test(
            replacementEmail
          )
        ) {

          return Response.json(
            {
              error:
                "Enter a valid email address.",
            },
            {
              status: 400,
            }
          );

        }


        if (
          ![
            "member",
            "remove",
          ].includes(
            previousOwnerAccess
          )
        ) {

          return Response.json(
            {
              error:
                "Select what should happen to your existing portal access.",
            },
            {
              status: 400,
            }
          );

        }


        // ===============================================
        // VERIFY AUTHENTICATED USER
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


        /*
          Require a recently issued access token.
          The portal will reauthenticate the owner
          with their password before calling this
          function.
        */

        const authorizationHeader =
  req.headers.get(
    "Authorization"
  );


const accessToken =
  authorizationHeader
    ?.replace(
      /^Bearer\s+/i,
      ""
    );


const {
  data: claimsData,
  error: claimsError,
} =
  await ctx.supabase.auth
    .getClaims(
      accessToken
    );


const tokenIssuedAt =
  Number(
    claimsData?.claims?.iat ||
    0
  );


const tokenAge =
  Math.floor(
    Date.now() / 1000
  ) -
  tokenIssuedAt;


if (
  claimsError ||
  !accessToken
) {

  return Response.json(
    {
      error:
        "We couldn't verify your recent sign-in. Please try again.",
    },
    {
      status: 401,
    }
  );

}


        if (
          !tokenIssuedAt ||
          tokenAge > 300
        ) {

          return Response.json(
            {
              error:
                "Please confirm your password again before transferring ownership.",
            },
            {
              status: 401,
            }
          );

        }


        if (
          replacementEmail ===
          currentUserEmail
        ) {

          return Response.json(
            {
              error:
                "The new owner must use a different email address.",
            },
            {
              status: 400,
            }
          );

        }


        // ===============================================
        // VERIFY CURRENT OWNERSHIP
        // ===============================================

        const {
          data: membership,
          error: membershipError,
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
            .maybeSingle();


        if (membershipError) {
          throw membershipError;
        }


        if (
          !membership ||
          membership.role !==
            "owner" ||
          membership.is_active !==
            true
        ) {

          return Response.json(
            {
              error:
                "Only the current active account owner can request an ownership transfer.",
            },
            {
              status: 403,
            }
          );

        }


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
              membership.client_id
            )
            .maybeSingle();


        if (clientError) {
          throw clientError;
        }


        if (!clientRecord) {

          return Response.json(
            {
              error:
                "The connected client company could not be found.",
            },
            {
              status: 404,
            }
          );

        }


        if (
          clientRecord.status ===
          "offboarded"
        ) {

          return Response.json(
            {
              error:
                "Ownership cannot be transferred for an offboarded client.",
            },
            {
              status: 409,
            }
          );

        }


        // ===============================================
        // CHECK EXISTING PENDING REQUEST
        // ===============================================

        const {
          data: pendingTransfer,
          error: pendingError,
        } =
          await ctx.supabaseAdmin
            .from(
              "ownership_transfer_requests"
            )
            .select(
              "id, replacement_email, expires_at"
            )
            .eq(
              "client_id",
              membership.client_id
            )
            .eq(
              "status",
              "pending"
            )
            .maybeSingle();


        if (pendingError) {
          throw pendingError;
        }


        if (pendingTransfer) {

          const isExpired =
            new Date(
              pendingTransfer.expires_at
            ).getTime() <=
            Date.now();


          if (isExpired) {

            const {
              error: expireError,
            } =
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
                  pendingTransfer.id
                )
                .eq(
                  "status",
                  "pending"
                );


            if (expireError) {
              throw expireError;
            }

          } else {

            return Response.json(
              {
                error:
                  "A pending ownership transfer already exists for this company.",
              },
              {
                status: 409,
              }
            );

          }

        }


        // ===============================================
        // CHECK REPLACEMENT ACCOUNT
        // ===============================================

        const existingAuthUser =
          await findAuthUserByEmail(
            ctx.supabaseAdmin,
            replacementEmail
          );


        if (
          existingAuthUser?.id ===
          currentUserId
        ) {

          return Response.json(
            {
              error:
                "You cannot transfer ownership to your own account.",
            },
            {
              status: 400,
            }
          );

        }


        if (existingAuthUser) {

          const {
            data:
              replacementMembership,

            error:
              replacementMembershipError,
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
                existingAuthUser.id
              )
              .maybeSingle();


          if (
            replacementMembershipError
          ) {
            throw replacementMembershipError;
          }


          if (
            replacementMembership &&
            replacementMembership
              .client_id !==
              membership.client_id
          ) {

            return Response.json(
              {
                error:
                  "That email is already connected to another client company.",
              },
              {
                status: 409,
              }
            );

          }

        }


        // ===============================================
        // CREATE PENDING TRANSFER
        // ===============================================

        const expiresAt =
          new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
          )
            .toISOString();


        const {
          data: transferRequest,
          error: transferError,
        } =
          await ctx.supabaseAdmin
            .from(
              "ownership_transfer_requests"
            )
            .insert({
              client_id:
                membership.client_id,

              requested_by:
                currentUserId,

              replacement_user_id:
                existingAuthUser?.id ||
                null,

              replacement_name:
                replacementName,

              replacement_email:
                replacementEmail,

              previous_owner_access:
                previousOwnerAccess,

              status:
                "pending",

              expires_at:
                expiresAt,
            })
            .select(
              "id, expires_at"
            )
            .single();


        if (transferError) {

          if (
            transferError.code ===
            "23505"
          ) {

            return Response.json(
              {
                error:
                  "A pending ownership transfer already exists for this company.",
              },
              {
                status: 409,
              }
            );

          }


          throw transferError;

        }


               // ===============================================
        // SEND SECURE ACCEPTANCE LINK
        // ===============================================

        let emailError =
          null;


        if (existingAuthUser) {

          /*
            Existing portal users retain their own
            password and receive a secure sign-in link
            directly to the transfer acceptance page.
          */

          const redirectUrl =
            `https://thealgorithmforge.com/ownership-transfer.html?request=${transferRequest.id}`;


          const {
            error,
          } =
            await ctx.supabaseAdmin
              .auth
              .signInWithOtp({
                email:
                  replacementEmail,

                options: {
                  shouldCreateUser:
                    false,

                  emailRedirectTo:
                    redirectUrl,
                },
              });


          emailError =
            error;

        } else {

          /*
            Brand-new users receive a real Supabase
            invitation and must create their own password
            before reviewing the ownership transfer.
          */

                const {
            data: inviteData,
            error,
          } =
            await ctx.supabaseAdmin
              .auth
              .admin
              .inviteUserByEmail(
                replacementEmail,
                {
                  redirectTo:
                    "https://thealgorithmforge.com/client-setup.html",

                  data: {
                    full_name:
                      replacementName,

                    ownership_transfer_request_id:
                      transferRequest.id,
                  },
                }
              );


          emailError =
            error;


          if (
            !emailError &&
            inviteData?.user?.id
          ) {

            const {
              error: linkError,
            } =
              await ctx.supabaseAdmin
                .from(
                  "ownership_transfer_requests"
                )
                .update({
                  replacement_user_id:
                    inviteData.user.id,
                })
                .eq(
                  "id",
                  transferRequest.id
                );


            if (linkError) {

              /*
                Invalidate the invitation if its Auth
                user could not be securely linked to
                the pending transfer.
              */

              await ctx.supabaseAdmin
                .auth
                .admin
                .deleteUser(
                  inviteData.user.id
                );


              emailError =
                linkError;

            }

          }

        }


        if (emailError) {

          /*
            Remove the pending record if the
            acceptance email could not be sent.
          */

          await ctx.supabaseAdmin
            .from(
              "ownership_transfer_requests"
            )
            .delete()
            .eq(
              "id",
              transferRequest.id
            );


          return Response.json(
            {
              error:
                emailError.message ||
                "The transfer invitation could not be sent.",
            },
            {
              status: 400,
            }
          );

        }
        // ===============================================
        // SUCCESS
        // ===============================================

        return Response.json({
          success:
            true,

          message:
            `Ownership transfer invitation sent to ${replacementEmail}.`,

          transfer_id:
            transferRequest.id,

          expires_at:
            transferRequest.expires_at,
        });


      } catch (error) {

        console.error(
          "Ownership transfer request failed:",
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
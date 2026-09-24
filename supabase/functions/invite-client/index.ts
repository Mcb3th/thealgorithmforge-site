import { withSupabase } from "npm:@supabase/server@^1";


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


    if (users.length < perPage) {
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

  if (error instanceof Error) {
    return error.message;
  }


  if (typeof error === "string") {
    return error;
  }


  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}


// =========================================================
// INVITE CLIENT PORTAL USER
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


        const email =
          String(
            body?.email ?? ""
          )
            .trim()
            .toLowerCase();


        const clientId =
          String(
            body?.client_id ?? ""
          )
            .trim();


        const contactName =
          String(
            body?.contact_name ?? ""
          )
            .trim();


        const contactPhone =
          String(
            body?.contact_phone ?? ""
          )
            .trim();


        const contactRole =
          String(
            body?.contact_role ??
            "Portal User"
          )
            .trim();


        const portalRole =
          String(
            body?.role ?? "member"
          )
            .trim()
            .toLowerCase();


        // =================================================
        // VALIDATE REQUEST
        // =================================================

        if (
          !email ||
          !clientId ||
          !contactName
        ) {

          return Response.json(
            {
              error:
                "Client ID, contact name, and email are required.",
            },
            {
              status: 400,
            }
          );
        }


        if (
          ![
            "owner",
            "manager",
            "member",
          ].includes(portalRole)
        ) {

          return Response.json(
            {
              error:
                "Invalid portal role.",
            },
            {
              status: 400,
            }
          );
        }


        // =================================================
        // VERIFY AF ADMIN
        // =================================================

        const adminUserId =
          ctx.userClaims?.id;


        if (!adminUserId) {

          return Response.json(
            {
              error:
                "Authenticated user could not be identified.",
            },
            {
              status: 401,
            }
          );
        }


        const {
          data: adminRecord,
          error: adminError,
        } =
          await ctx.supabaseAdmin
            .from("admin_users")
            .select("user_id, role")
            .eq(
              "user_id",
              adminUserId
            )
            .maybeSingle();


        if (adminError) {
          throw adminError;
        }


        if (!adminRecord) {

          return Response.json(
            {
              error:
                "Admin access required.",
            },
            {
              status: 403,
            }
          );
        }


        // =================================================
        // VERIFY CLIENT
        // =================================================

        const {
          data: clientRecord,
          error: clientError,
        } =
          await ctx.supabaseAdmin
            .from("clients")
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
                "Client not found.",
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
                "This client is offboarded. Reactivate the client before adding portal access.",
            },
            {
              status: 409,
            }
          );
        }

                // =================================================
        // PREVENT MULTIPLE ACTIVE OWNERS
        // =================================================

        if (
          portalRole ===
          "owner"
        ) {

          const {
            data: existingOwner,
            error: ownerLookupError,
          } =
            await ctx.supabaseAdmin
              .from("client_users")
              .select("user_id")
              .eq(
                "client_id",
                clientRecord.id
              )
              .eq(
                "role",
                "owner"
              )
              .eq(
                "is_active",
                true
              )
              .limit(1)
              .maybeSingle();


          if (ownerLookupError) {
            throw ownerLookupError;
          }


          if (existingOwner) {

            return Response.json(
              {
                error:
                  "This client already has an active owner. Use the secure ownership transfer process to change ownership.",
              },
              {
                status: 409,
              }
            );
          }
        }

        // =================================================
        // CHECK FOR AN EXISTING AUTH USER
        // =================================================

        const existingAuthUser =
          await findAuthUserByEmail(
            ctx.supabaseAdmin,
            email
          );


        let portalUser =
          existingAuthUser;

        let invitationSent =
          false;

        let membershipRestored =
          false;


        if (existingAuthUser) {

          const {
            data: existingMembership,
            error: membershipLookupError,
          } =
            await ctx.supabaseAdmin
              .from("client_users")
              .select(
                "user_id, client_id, role, is_active"
              )
              .eq(
                "user_id",
                existingAuthUser.id
              )
              .maybeSingle();


          if (membershipLookupError) {
            throw membershipLookupError;
          }


          if (
            existingMembership &&
            existingMembership.client_id !==
              clientRecord.id
          ) {

            return Response.json(
              {
                error:
                  "This email is already connected to another client company.",
              },
              {
                status: 409,
              }
            );
          }


          if (
            existingMembership?.is_active
          ) {

            return Response.json(
              {
                error:
                  "This person already has active portal access for this client.",
              },
              {
                status: 409,
              }
            );
          }


          if (existingMembership) {

            const {
              error: restoreError,
            } =
              await ctx.supabaseAdmin
                .from("client_users")
                .update({
                  role:
                    portalRole,

                  is_active:
                    true,

                  deactivated_by_offboarding_at:
                    null,
                })
                .eq(
                  "user_id",
                  existingAuthUser.id
                );


            if (restoreError) {
              throw restoreError;
            }


            membershipRestored =
              true;

          } else {

            const {
              error: membershipInsertError,
            } =
              await ctx.supabaseAdmin
                .from("client_users")
                .insert({
                  user_id:
                    existingAuthUser.id,

                  client_id:
                    clientRecord.id,

                  role:
                    portalRole,

                  is_active:
                    true,
                });


            if (membershipInsertError) {
              throw membershipInsertError;
            }
          }

        } else {

          // ===============================================
          // INVITE A BRAND-NEW AUTH USER
          // ===============================================

          const {
            data: inviteData,
            error: inviteError,
          } =
            await ctx.supabaseAdmin
              .auth
              .admin
              .inviteUserByEmail(
                email,
                {
                  redirectTo:
                    "https://thealgorithmforge.com/client-setup.html",

                  data: {
                    client_id:
                      clientRecord.id,

                    business_name:
                      clientRecord.business_name,

                    client_role:
                      portalRole,

                    contact_name:
                      contactName,
                  },
                }
              );


          if (
            inviteError ||
            !inviteData?.user
          ) {

            return Response.json(
              {
                error:
                  inviteError?.message ||
                  "Client invitation could not be created.",
              },
              {
                status: 400,
              }
            );
          }


          portalUser =
            inviteData.user;

          invitationSent =
            true;


          const {
            error: membershipInsertError,
          } =
            await ctx.supabaseAdmin
              .from("client_users")
              .insert({
                user_id:
                  portalUser.id,

                client_id:
                  clientRecord.id,

                role:
                  portalRole,

                is_active:
                  true,
              });


          if (membershipInsertError) {
            throw membershipInsertError;
          }
        }


        if (!portalUser?.id) {

          throw new Error(
            "Portal user could not be resolved."
          );
        }


        // =================================================
        // CREATE OR UPDATE CONTACT RECORD
        // =================================================

        const {
          data: existingContact,
          error: contactLookupError,
        } =
          await ctx.supabaseAdmin
            .from("contacts")
            .select(
              "id, is_primary, is_approval_contact"
            )
            .eq(
              "client_id",
              clientRecord.id
            )
            .ilike(
              "email",
              email
            )
            .limit(1)
            .maybeSingle();


        if (contactLookupError) {
          throw contactLookupError;
        }


        let contactId =
          existingContact?.id || null;


        if (existingContact) {

          const {
            error: contactUpdateError,
          } =
            await ctx.supabaseAdmin
              .from("contacts")
              .update({
                name:
                  contactName,

                role:
                  contactRole || null,

                email,

                phone:
                  contactPhone || null,
              })
              .eq(
                "id",
                existingContact.id
              );


          if (contactUpdateError) {
            throw contactUpdateError;
          }

        } else {

          const {
            data: createdContact,
            error: contactInsertError,
          } =
            await ctx.supabaseAdmin
              .from("contacts")
              .insert({
                client_id:
                  clientRecord.id,

                name:
                  contactName,

                role:
                  contactRole || null,

                email,

                phone:
                  contactPhone || null,

                is_primary:
                  false,

                is_approval_contact:
                  false,

                preferred_contact_method:
                  "email",
              })
              .select("id")
              .single();


          if (contactInsertError) {
            throw contactInsertError;
          }


          contactId =
            createdContact.id;
        }


        // =================================================
        // SUCCESS
        // =================================================

        let message =
          `${contactName} now has portal access.`;


        if (invitationSent) {

          message =
            `Invitation sent to ${email}.`;

        } else if (membershipRestored) {

          message =
            `${contactName}'s existing portal access was restored.`;

        }


        return Response.json({
          success:
            true,

          message,

          invitation_sent:
            invitationSent,

          membership_restored:
            membershipRestored,

          user_id:
            portalUser.id,

          client_id:
            clientRecord.id,

          business_name:
            clientRecord.business_name,

          contact_id:
            contactId,

          contact_name:
            contactName,

          email,

          contact_role:
            contactRole || null,

          portal_role:
            portalRole,
        });


      } catch (error) {

        console.error(
          "Invite client failed:",
          error
        );


        return Response.json(
          {
            error:
              getErrorMessage(error),
          },
          {
            status: 500,
          }
        );
      }
    }
  ),
};
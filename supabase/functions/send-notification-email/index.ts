// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import {
  withSupabase,
} from "jsr:@supabase/server@^1";


interface NotificationRecord {
  id: string;
  recipient_user_id: string;
  client_id: string | null;
  notification_type: string;
  title: string;
  message: string;
  action_url: string | null;
  metadata: Record<string, unknown> | null;
}


interface WebhookPayload {
  type: string;
  table: string;
  schema: string;
  record: NotificationRecord;
}

interface NotificationPreferences {
  email_enabled: boolean;
  email_content_awaiting_approval: boolean;
  email_content_scheduled: boolean;
  email_content_posted: boolean;
}


const EMAIL_NOTIFICATION_TYPES =
  new Set([
    "client_upload",
    "content_approved",
    "content_awaiting_approval",
    "content_changes_requested",
    "content_posted",
    "content_scheduled",
    "onboarding_completed",
    "onboarding_updated",
    "ownership_transfer_accepted",
    "ownership_transfer_completed",
  ]);

  const CLIENT_OPTIONAL_EMAIL_TYPES =
  new Set([
    "content_awaiting_approval",
    "content_scheduled",
    "content_posted",
  ]);


function shouldSkipClientEmail(
  notificationType: string,
  preferences: NotificationPreferences | null,
) {

  /*
    No saved row means the user has never changed
    their settings, so all emails remain enabled.
  */

  if (!preferences) {
    return false;
  }


  if (
    preferences.email_enabled ===
    false
  ) {
    return true;
  }


  switch (
    notificationType
  ) {

    case "content_awaiting_approval":

      return (
        preferences
          .email_content_awaiting_approval ===
        false
      );


    case "content_scheduled":

      return (
        preferences
          .email_content_scheduled ===
        false
      );


    case "content_posted":

      return (
        preferences
          .email_content_posted ===
        false
      );


    default:

      return false;

  }

}


function escapeHtml(
  value: unknown,
) {

  return String(
    value ?? "",
  )
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );

}


function getNotificationUrl(
  notification: NotificationRecord,
) {

  const metadata =
    notification.metadata || {};


  const contentItemId =
    typeof metadata.content_item_id ===
      "string"
      ? metadata.content_item_id
      : null;


  if (
    [
      "content_approved",
      "content_changes_requested",
    ].includes(
      notification.notification_type,
    ) &&
    contentItemId
  ) {

    return (
      "https://thealgorithmforge.com/" +
      `admin.html#content/${contentItemId}`
    );

  }


  if (
    [
      "client_upload",
      "onboarding_completed",
      "onboarding_updated",
    ].includes(
      notification.notification_type,
    ) &&
    notification.client_id
  ) {

    return (
      "https://thealgorithmforge.com/" +
      `admin.html#clients/${notification.client_id}`
    );

  }


  if (
    [
      "content_awaiting_approval",
      "content_posted",
      "content_scheduled",
    ].includes(
      notification.notification_type,
    )
  ) {

    return (
      "https://thealgorithmforge.com/" +
      "client-portal.html#content"
    );

  }


  const relativeUrl =
    notification.action_url
      ?.startsWith("/")
      ? notification.action_url
      : "/client-portal.html#dashboard";


  return new URL(
    relativeUrl,
    "https://thealgorithmforge.com",
  ).toString();

}


function buildEmailHtml(
  notification: NotificationRecord,
  destinationUrl: string,
) {

  const safeTitle =
    escapeHtml(
      notification.title,
    );


  const safeMessage =
    escapeHtml(
      notification.message,
    );


  const safeUrl =
    escapeHtml(
      destinationUrl,
    );


  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    >
    <title>${safeTitle}</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f0e8;
      font-family: Arial, Helvetica, sans-serif;
      color: #202124;
    "
  >

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background: #f4f0e8;"
    >
      <tr>
        <td
          align="center"
          style="padding: 32px 16px;"
        >

          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              max-width: 620px;
              background: #ffffff;
              border: 1px solid #dedbd5;
              border-radius: 16px;
              overflow: hidden;
            "
          >

            <tr>
              <td
                style="
                  padding: 24px 28px;
                  background: #202124;
                  color: #ffffff;
                "
              >
                <div
                  style="
                    color: #ff5a24;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                  "
                >
                  The Algorithm Forge
                </div>

                <div
                  style="
                    margin-top: 8px;
                    font-size: 24px;
                    font-weight: 800;
                  "
                >
                  ${safeTitle}
                </div>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 30px 28px;
                  font-size: 16px;
                  line-height: 1.65;
                "
              >
                <p
                  style="
                    margin: 0 0 24px;
                    color: #5f6470;
                  "
                >
                  ${safeMessage}
                </p>

                <a
                  href="${safeUrl}"
                  style="
                    display: inline-block;
                    padding: 13px 20px;
                    border-radius: 8px;
                    background: #ff5a24;
                    color: #ffffff;
                    font-weight: 700;
                    text-decoration: none;
                  "
                >
                  Open Portal
                </a>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px 28px;
                  border-top: 1px solid #ece8e1;
                  color: #777b85;
                  font-size: 12px;
                  line-height: 1.5;
                "
              >
                You received this message because this
                email is connected to an Algorithm Forge
                portal account.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
  `;

}


console.info(
  "notification email dispatcher started",
);


export default {

  fetch: withSupabase(
    {
      auth: [
        "publishable",
        "secret",
      ],
    },

    async (
      req,
      ctx,
    ) => {

      if (
        req.method !==
        "POST"
      ) {

        return Response.json(
          {
            error:
              "Method not allowed.",
          },
          {
            status: 405,
          },
        );

      }


      const expectedWebhookSecret =
        Deno.env.get(
          "NOTIFICATION_WEBHOOK_SECRET",
        );


      const receivedWebhookSecret =
        req.headers.get(
          "x-webhook-secret",
        );


      if (
        !expectedWebhookSecret ||
        !receivedWebhookSecret ||
        receivedWebhookSecret !==
          expectedWebhookSecret
      ) {

        return Response.json(
          {
            error:
              "Unauthorized webhook request.",
          },
          {
            status: 401,
          },
        );

      }


      const resendApiKey =
        Deno.env.get(
          "RESEND_API_KEY",
        );


      if (!resendApiKey) {

        console.error(
          "RESEND_API_KEY is missing.",
        );


        return Response.json(
          {
            error:
              "Email delivery is not configured.",
          },
          {
            status: 500,
          },
        );

      }


      let payload:
        WebhookPayload;


      try {

        payload =
          await req.json();

      } catch {

        return Response.json(
          {
            error:
              "Invalid webhook payload.",
          },
          {
            status: 400,
          },
        );

      }


      const notification =
        payload?.record;


      if (
        payload?.type !==
          "INSERT" ||
        payload?.schema !==
          "public" ||
        payload?.table !==
          "notifications" ||
        !notification?.id ||
        !notification
          ?.recipient_user_id
      ) {

        return Response.json(
          {
            error:
              "Unsupported webhook payload.",
          },
          {
            status: 400,
          },
        );

      }


      if (
        !EMAIL_NOTIFICATION_TYPES
          .has(
            notification
              .notification_type,
          )
      ) {

        await ctx.supabaseAdmin
          .from(
            "notification_email_deliveries",
          )
          .upsert(
            {
              notification_id:
                notification.id,

              status:
                "skipped",

              updated_at:
                new Date()
                  .toISOString(),
            },
            {
              onConflict:
                "notification_id",

              ignoreDuplicates:
                true,
            },
          );


        return Response.json({
          success: true,
          skipped: true,
        });

      }


      const attemptedAt =
        new Date()
          .toISOString();


      let deliveryId:
        string | null =
          null;


      const {
        data: newDelivery,
        error: deliveryInsertError,
      } =
        await ctx.supabaseAdmin
          .from(
            "notification_email_deliveries",
          )
          .insert({
            notification_id:
              notification.id,

            status:
              "sending",

            attempt_count:
              1,

            last_attempted_at:
              attemptedAt,

            updated_at:
              attemptedAt,
          })
          .select(
            "id",
          )
          .maybeSingle();


      if (
        deliveryInsertError?.code ===
        "23505"
      ) {

        const {
          data: existingDelivery,
          error: existingError,
        } =
          await ctx.supabaseAdmin
            .from(
              "notification_email_deliveries",
            )
            .select(
              "id, status, attempt_count",
            )
            .eq(
              "notification_id",
              notification.id,
            )
            .maybeSingle();


        if (
          existingError ||
          !existingDelivery
        ) {

          throw (
            existingError ||
            new Error(
              "Existing delivery record could not be loaded.",
            )
          );

        }


        if (
          existingDelivery.status !==
          "failed"
        ) {

          return Response.json({
            success: true,
            duplicate: true,
            status:
              existingDelivery.status,
          });

        }


        const {
          data: retriedDelivery,
          error: retryError,
        } =
          await ctx.supabaseAdmin
            .from(
              "notification_email_deliveries",
            )
            .update({
              status:
                "sending",

              attempt_count:
                existingDelivery
                  .attempt_count +
                1,

              last_attempted_at:
                attemptedAt,

              last_error:
                null,

              updated_at:
                attemptedAt,
            })
            .eq(
              "id",
              existingDelivery.id,
            )
            .eq(
              "status",
              "failed",
            )
            .select(
              "id",
            )
            .maybeSingle();


        if (
          retryError ||
          !retriedDelivery
        ) {

          return Response.json({
            success: true,
            duplicate: true,
          });

        }


        deliveryId =
          retriedDelivery.id;

      } else if (
        deliveryInsertError
      ) {

        throw deliveryInsertError;

      } else {

        deliveryId =
          newDelivery?.id ||
          null;

      }


      if (!deliveryId) {

        throw new Error(
          "Email delivery record could not be claimed.",
        );

      }


      try {

                /*
          Only the three client-facing content email
          types can be disabled. Administrative,
          ownership, and account emails remain enabled.
        */

        if (
          CLIENT_OPTIONAL_EMAIL_TYPES
            .has(
              notification
                .notification_type,
            )
        ) {

          const {
            data: preferences,
            error: preferenceError,
          } =
            await ctx.supabaseAdmin
              .from(
                "notification_preferences",
              )
              .select(`
                email_enabled,
                email_content_awaiting_approval,
                email_content_scheduled,
                email_content_posted
              `)
              .eq(
                "user_id",
                notification
                  .recipient_user_id,
              )
              .maybeSingle();


          if (preferenceError) {
            throw preferenceError;
          }


          if (
            shouldSkipClientEmail(
              notification
                .notification_type,
              preferences,
            )
          ) {

            const skippedAt =
              new Date()
                .toISOString();


            const {
              error: skippedUpdateError,
            } =
              await ctx.supabaseAdmin
                .from(
                  "notification_email_deliveries",
                )
                .update({
                  status:
                    "skipped",

                  provider_message_id:
                    null,

                  sent_at:
                    null,

                  last_error:
                    "Recipient disabled this email notification.",

                  updated_at:
                    skippedAt,
                })
                .eq(
                  "id",
                  deliveryId,
                );


            if (skippedUpdateError) {
              throw skippedUpdateError;
            }


            return Response.json({
              success: true,
              skipped: true,
              reason:
                "recipient_preferences",
              notification_id:
                notification.id,
            });

          }

        }

        const {
          data: userData,
          error: userError,
        } =
          await ctx.supabaseAdmin
            .auth
            .admin
            .getUserById(
              notification
                .recipient_user_id,
            );


        if (
          userError ||
          !userData?.user?.email
        ) {

          throw (
            userError ||
            new Error(
              "Notification recipient email was not found.",
            )
          );

        }


        const destinationUrl =
          getNotificationUrl(
            notification,
          );


        const resendResponse =
          await fetch(
            "https://api.resend.com/emails",
            {
              method:
                "POST",

              headers: {
                "Authorization":
                  `Bearer ${resendApiKey}`,

                "Content-Type":
                  "application/json",

                "Idempotency-Key":
                  `notification-${notification.id}`,
              },

              body:
                JSON.stringify({
                  from:
                    "The Algorithm Forge <notifications@updates.thealgorithmforge.com>",

                  to: [
                    userData
                      .user
                      .email,
                  ],

                  reply_to:
                    "hello@thealgorithmforge.com",

                  subject:
                    notification.title,

                  html:
                    buildEmailHtml(
                      notification,
                      destinationUrl,
                    ),
                }),
            },
          );


        const resendBody =
          await resendResponse
            .json()
            .catch(
              () => ({}),
            );


        if (
          !resendResponse.ok
        ) {

          throw new Error(
            String(
              resendBody?.message ||
              `Resend returned ${resendResponse.status}.`,
            ),
          );

        }


        const completedAt =
          new Date()
            .toISOString();


        const {
          error: sentUpdateError,
        } =
          await ctx.supabaseAdmin
            .from(
              "notification_email_deliveries",
            )
            .update({
              status:
                "sent",

              provider_message_id:
                resendBody?.id ||
                null,

              sent_at:
                completedAt,

              last_error:
                null,

              updated_at:
                completedAt,
            })
            .eq(
              "id",
              deliveryId,
            );


        if (sentUpdateError) {
          throw sentUpdateError;
        }


        return Response.json({
          success: true,
          sent: true,
          notification_id:
            notification.id,
        });

      } catch (error) {

                const failureMessage =
          error instanceof Error
            ? error.message
            : (
                typeof error ===
                  "object" &&
                error !==
                  null &&
                "message" in
                  error
              )
              ? String(
                  (
                    error as {
                      message?: unknown;
                    }
                  ).message ??
                  JSON.stringify(
                    error,
                  ),
                )
              : String(
                  error,
                );


        console.error(
          "Notification email delivery failed:",
          failureMessage,
        );


        await ctx.supabaseAdmin
          .from(
            "notification_email_deliveries",
          )
          .update({
            status:
              "failed",

            last_error:
              failureMessage
                .slice(
                  0,
                  2000,
                ),

            updated_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            deliveryId,
          );


        return Response.json(
          {
            success: false,
            error:
              "Email delivery failed.",
          },
          {
            status: 500,
          },
        );

      }

    },
  ),

};
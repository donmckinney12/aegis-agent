import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
        case "checkout.session.completed":
            const subscriptionId = session.subscription;
            const clerkUserId = session.metadata?.clerkUserId;

            console.log(`✅ Webhook received! User ${clerkUserId} subscribed with sub ID: ${subscriptionId}`);

            if (clerkUserId) {
                // Determine which plan they bought based on amount or metadata (for now, default to growth if purchased)
                // In a production app, you'd map the priceId to the exact tier string.
                const client = await clerkClient();
                await client.users.updateUserMetadata(clerkUserId, {
                    publicMetadata: {
                        stripeSubscriptionId: subscriptionId,
                        tier: "growth" // Hardcoding growth for the prototype, dynamically pull from price ID in prod
                    }
                });
                console.log(`Updated Clerk User ${clerkUserId} to growth tier.`);
            }
            break;

        case "invoice.payment_succeeded":
            console.log(`💸 Invoice payment succeeded for session: ${session.id}`);
            // Renew their quotas for the month
            break;

        case "customer.subscription.deleted":
            console.log(`❌ Subscription canceled for customer: ${session.customer}`);

            // We need to find the user by their Stripe Customer ID, but since we don't have a DB,
            // we would normally look it up. For this prototype, if we passed clerkUserId closely,
            // we could revert it. Next.js doesn't provide clerkId on the deleted event natively 
            // unless we added it to the customer metadata during creation.
            // If we did:
            // const deletedClerkId = session.customer_details?.metadata?.clerkUserId;
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
}

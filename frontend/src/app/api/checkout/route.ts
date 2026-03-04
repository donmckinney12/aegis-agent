import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to upgrade." }, { status: 401 });
        }

        const body = await req.json();
        const { priceId } = body;

        if (!priceId) {
            return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
        }

        const email = user.emailAddresses[0]?.emailAddress;

        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${req.nextUrl.origin}${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.nextUrl.origin}${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}?canceled=true`,
            metadata: {
                clerkUserId: userId,
            },
        });

        if (!session.url) {
            return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
        }

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

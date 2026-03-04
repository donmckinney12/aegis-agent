import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress;

        // Try to find the customer in Stripe by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        });

        let customerId;

        // If customer exists, use their ID
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            // It's possible the user hasn't checked out yet, but clicked 'Manage Billing'
            return NextResponse.json({ error: "No active subscription found. Please purchase a plan first." }, { status: 404 });
        }

        // Generate the Stripe Customer Portal session URL
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.nextUrl.origin}/billing`,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (error) {
        console.error("Stripe Portal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

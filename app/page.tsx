import { LoginForm } from "@/components/feature";
import { AuthLayout } from "@/components/layouts";
import { CustomImage } from "@/components/ui";

export default function Home() {
    return (
        <div className=" w-full h-screen overflow-hidden flex bg-primary-50 " >
            <div className=" w-full h-screen " >
                <CustomImage src={"/images/auth.png"} alt="auth" layout="width" />
            </div>
            <div className=" w-full h-screen overflow-y-auto py-10 px-6 flex justify-center" > 
                <AuthLayout title="Admin Log In" body="Enter your admin email to receive a verification code." >
                    <LoginForm />
                </AuthLayout>
            </div>
        </div>
    );
}

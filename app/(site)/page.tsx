import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="/images/logo.png"
          alt="logo"
          height={48}
          width={48}
          className="mx-auto w-auto"
        />
        <h2 className="text-gray-900 font-bold text-3xl text-center mt-6 tracking-tight">
          Sign in to your account
        </h2>
      </div>
    </main>
  );
}
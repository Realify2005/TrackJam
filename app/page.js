"use client";

import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/dashboard');
    return null;
  }

  return (
    <main className="bg-gray-300 min-h-screen flex justify-center items-center">
      <div className="bg-white max-w-sm w-full min-h-screen rounded-lg shadow-md flex flex-col items-center">
        {!session ? (
          <>
            {/* Background Image Section */}
            <div 
              className="relative w-full h-80 bg-cover bg-center rounded-t-lg" 
              style={{ backgroundImage: 'url(/headerPicture.png)' }}
            >
              {/* iPhone-like Header */}
              <div className="relative w-full h-full">
                <Image
                  src="/Header.png"
                  alt="iPhone header"
                  width={450}
                  height={50}
                  className="absolute top-0 w-full rounded-t-lg z-50"
                />
                <div className="absolute inset-x-0 top-20 flex justify-center">
                  <Image
                    src="/trackJamLogo.png"
                    alt="TrackJam Logo"
                    width={225}
                    height={150}
                    className="mt-60" // Larger to avoid cropping
                  />
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="text-center mt-40 px-4">
              <h1 className="text-2xl font-bold">Stream, team, and reign supreme with TrackJam!</h1>
              <p className="mt-4 text-lg text-gray-500">
                Compare your Spotify listening minutes, challenge friends, and climb the leaderboard. Share song recommendations to earn points and expand your musical horizons.
              </p>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col items-center gap-4 mt-4 mb-24 w-full px-4 mt-8">
              <button 
                className="bg-green-600 text-white py-2 px-6 rounded-lg text-lg w-full"
                onClick={() => signIn('spotify')}
              >
                Connect with Spotify
              </button>
              <button 
                className="bg-gray-400 text-white py-2 px-6 rounded-lg text-lg w-full"
                disabled
              >
                Log in
              </button>
            </div>

            {/* iPhone-like Footer */}
            <div className="w-full">
              <Image
                src="/FooterBar.png"
                alt="iPhone footer"
                width={450}
                height={50}
                className="w-full"
              />
            </div>

            <div className="fixed bottom-0 justify-center mt-4">
              <Image
                src="/FooterBar.png"
                alt="Footer Bar"
                width={250}
                height={250}
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mt-6">Welcome, {session.user.name}!</h1>
            <p className="mt-2 text-lg">You&apos;re logged in with Spotify.</p>
            <p className="mt-2 text-lg">Let&apos;s continue your music journey with TrackJam.</p>

            <button 
              className="bg-red-500 text-white py-2 px-6 rounded-lg text-lg mt-6"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </main>
  );
}

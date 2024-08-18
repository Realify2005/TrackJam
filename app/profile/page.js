"use client";

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [status, session]);

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/', // Redirect to homepage after sign out
    });
  };

  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center relative font-londrina">
      <div className="bg-white max-w-sm w-full min-h-screen rounded-lg shadow-md flex flex-col items-center">
        <div className="w-full bg-white rounded-b-lg border-black border-b-2 shadow-2xl flex items-center flex-col sticky top-0 z-50">
          <Image
            src={"/Header.png"}
            alt={"iPhone header"}
            width={450}
            height={50}
          />

          <div className="mt-4">
            <Image
              src={"/TrackJam.png"}
              alt={"TrackJam logo"}
              width={130}
              height={130}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow justify-center items-center text-center px-12 pb-20 h-max bg-purple-300">
          {session ? (
            <h1 className="text-xl font-bold mb-4 text-4xl text-purple-800">
              Welcome, {session.user.name}
            </h1>
          ) : (
            <p>Loading...</p>
          )}
          {user ? (
            <>
              <p className="font-relaxed text-purple-700 text-lg">
                You&apos;ve listened to <span className="bg-green-200">{user.listeningMinutes.toFixed(2) || 0}</span> minutes of music today.
              </p>
              <p className="font-relaxed text-purple-700 text-lg">
                You currently have <span className="bg-green-200">{user.points.toFixed(0) || 0}</span> points.
              </p>
              <p className="font-relaxed text-purple-700 text-lg">
                Last played track is <span className="bg-green-200">{user.lastPlayedTrackName || "N/A"}</span> by <span className="bg-green-200">{user.lastPlayedTrackArtist || "N/A"}</span>.
              </p>

              <div className="flex flex-col items-center mt-8">
                <h3 className="text-xl font-bold mb-2 text-purple-900">Top 4 Tracks</h3>
                <div className="grid grid-cols-2 grid-rows-2 justify-center items-center gap-8">
                  {user.topTracks?.map((track, index) => (
                    <div key={index} className="flex flex-col items-center text-purple-500">
                      <Image
                        src={track.albumImage}
                        alt={`Album cover for ${track.trackName}`}
                        width={150}
                        height={150}
                        className="rounded"
                      />
                      <p className="text-md mt-4 bg-yellow-200">{track.trackName}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 mb-8">
                  <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded w-full">
                      Sign Out
                  </button>
                </div>

              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}

        </div>

        {/* NAVBAR */}
        <div className="fixed bottom-0 w-96 grid grid-cols-4 gap-4 px-4 py-4 justify-center items-center bg-purple-700 pb-8" style={{ backgroundColor: '#6C2DEB' }}>
          <Link href="/">
            <Image
              src="/Home.png"
              alt="Home"
              width={50}
              height={50}
            />
          </Link>

          <Link href="/search">
            <Image
              src="/Search.png"
              alt="Search"
              width={50}
              height={50}
            />
          </Link>

          <Link href="/leaderboard">
            <Image
              src="/Barchart.png"
              alt="Leaderboard"
              width={50}
              height={50}
            />
          </Link>

          <Link href="/profile">
            <Image
              src="/Profile.png"
              alt="Profile"
              width={50}
              height={50}
            />
          </Link>
        </div>

        <div className="fixed bottom-0 justify-center mt-4">
          <Image
            src="/FooterBar.png"
            alt="Footer Bar"
            width={250}
            height={250}
          />
        </div>
      </div>
    </div>
  );
}

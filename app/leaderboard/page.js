"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Leaderboard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [friendsData, setFriendsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for tracking loading
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  // Fetch user and friends data
  const fetchUserData = async () => {
    if (session && status === "authenticated") {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setUser(response.data);

        const friendsResponse = await axios.get('/api/friends', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setFriendsData(friendsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [session, status]);

  // Filter out any null or undefined entries
  const validData = [user, ...friendsData].filter(Boolean);

  // Sort by listening minutes or points
  const sortedData = validData.sort((a, b) => b.listeningMinutes - a.listeningMinutes);

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
      <div className="bg-white max-w-md w-full p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Leaderboard</h1>

        {isLoading ? ( // Display loading text if data is still loading
          <p className="text-center text-lg">Loading... Please Wait</p>
        ) : (
          <ul>
            {sortedData.map((person, index) => (
              <li key={person.id} className="mb-4 p-4 bg-purple-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-xl font-semibold mr-4">{index + 1}</span>
                    <Image
                      src={'/blankpfp.png'} // Replace with the correct path
                      alt={`${person.name} Profile`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-lg">{person.name}</p>
                      <p className="text-sm">Points: {(person.points + person.listeningMinutes).toFixed(2)}</p>
                      <p className="text-sm">Listening Minutes: {person.listeningMinutes.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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

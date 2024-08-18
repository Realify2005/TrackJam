"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AddFriend() {
  const { data: session, status } = useSession();
  const [friendEmail, setFriendEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  const addFriend = async () => {
    if (status === "authenticated" && session) {
      try {
        await axios.post('/api/friends', { friendEmail }, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Make sure the token is passed correctly
          },
        });
    
        setFriendEmail('');
        setMessage('Friend added successfully!');

      } catch (error) {
        console.error('Error adding friend:', error);
        setMessage('Failed to add friend. Please try again.');
      }
    } else {
      setMessage('You are not authenticated. Please log in.');
    }
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

        <div className="flex flex-col flex-grow justify-center items-center text-center px-20 py-12 h-max bg-purple-300">
            <h1 className="text-xl font-bold mb-4 text-5xl text-purple-800">Add Your Friends!</h1>
            <p className="font-relaxed text-purple-700">Input your friend&apos;s email address to add them as friend.</p>
            <Image 
              src={"/AddFriendPicture.png"}
              alt={"Add Friend"}
              width={400}
              height={400}
              className="mb-4 h-64 w-64"
            />
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="Friend's Email"
              className="mb-4 w-full p-2 border border-gray-300 rounded"
            />
            <button onClick={addFriend} className="bg-green-500 text-white p-2 rounded w-full">
              Add Friend
            </button>
            {message && <p className="mt-4 text-center">{message}</p>}
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

"use client";

import { useState, Fragment, useEffect, useContext } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SocketContext } from "@/context/socket-context";

export function Search() {

  const { tags } = useContext(SocketContext)

  const [query, setQuery] = useState("");

  const router = useRouter()

  function navigate(tag: string) {
    router.push(`/tag/${tag}`)
  }

  const selectedTag = ""
  const filteredTags = tags.filter((tag) => tag.includes(query));

  return (
    <Combobox value={selectedTag} onChange={navigate}>
      <div className="relative mt-1 w-96">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            +
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {tags.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredTags.map((tag, index) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none w-full ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={tag}
                >
                  <Link href={`/tag/${tag}`} className="block w-full p-2"> {tag} </Link>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

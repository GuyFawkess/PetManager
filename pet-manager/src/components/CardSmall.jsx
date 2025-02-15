import React, { useState, useEffect } from "react";
import { PROJECT_ID, STORAGE_ID } from "../appwriteConfig";
import { Storage, Client, ID } from "appwrite";

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID);

const storage = new Storage(client);

const CardSmall = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/0/0a/Paw_%28Animal_Rights_symbol%29.png");

   
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#dropdownButton") && !event.target.closest("#dropdown")) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const response = await storage.createFile(STORAGE_ID, ID.unique(), file);

                if (response && response.$id) {
                    const fileId = response.$id;
                    const newImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
                    setImageUrl(newImageUrl); 
                }
            } catch (error) {
                console.error('Error al subir el archivo:', error);
            }
        }
    };

    return (
        <div className="mt-6 w-full max-w-sm bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:shadow-lg">
            <div className="flex justify-end px-6 pt-6">
                <button
                    id="dropdownButton"
                    onClick={toggleDropdown}
                    className="inline-block text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-2"
                    type="button"
                >
                    <span className="sr-only">Open dropdown</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                </button>
                <div id="dropdown" className={`absolute z-10 ${dropdownOpen ? "block" : "hidden"} bg-white dark:bg-gray-700 text-base rounded-xl shadow-lg w-44 divide-y divide-gray-100 dark:divide-gray-600`}>
                    <ul className="py-2" aria-labelledby="dropdownButton">
                        <li>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                        </li>
                        <li>
                            <input
                                type="file"
                                id="uploader"
                                accept="image/*"
                                onChange={handleFileChange} 
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col items-center pb-8">
                <img
                    className="w-35 h-35 mb-4 rounded-full border-4 border-gray-100 shadow-xl"
                    src={imageUrl} 
                    alt="Pet image"
                />
                <h5 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Bonnie Green</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                <div className="flex mt-5 space-x-3">
                    <a href="#" className="inline-flex items-center px-6 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-300">Add Friend</a>
                </div>
            </div>
        </div>
    );
};

export default CardSmall;


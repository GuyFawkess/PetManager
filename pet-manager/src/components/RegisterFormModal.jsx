import React, { useState, useEffect, useRef } from "react";
import usePetsStore from "../store/usePetsStore";
import { useRegisterStore } from "../store/useRegisterStore";
import { useAuth } from "../store/AuthContext";
import ConfirmationModal from '../components/ConfirmationModal';
import { toast, Flip, Bounce } from "react-toastify";


const RegisterFormModal = ({ closeModal, pet }) => {

    const { fetchRegisterData, addRegisterEntry } = useRegisterStore();
    const { user } = useAuth();
    const [register, setRegister] = useState({
        activity_level: "", food: "", substrate: "", water: "", last_feeding: "", temperature: "",
        humidity: "", weight: "", medical_conditions: [], medication: []
    })
    const [newCondition, setNewCondition] = useState("");
    const [newMedication, setNewMedication] = useState("")
    const [loading, setLoading] = useState(false);

    const closeModalBgClick = (e) => {
        if (e.target.id === "modal-bg") {
            closeModal();
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let parsedValue = value;
    
        if (type === "number") {
            parsedValue = value ? parseFloat(value) : null;
        } else if (type === "date") {
            parsedValue = value || "";}
    
        setRegister({ ...register, [name]: parsedValue });
    };
    

    const handleAddCondition = () => {
        if (newCondition) {
            setRegister({
                ...register,
                medical_conditions: [...register.medical_conditions, newCondition],
            });
            setNewCondition(""); // Clear the input after adding
        }
    };

    const handleAddMedication = () => {
        if (newMedication) {
            setRegister({
                ...register,
                medication: [...register.medication, newMedication],
            });
            setNewMedication(""); // Clear the input after adding
        }
    };

    const handleDeleteCondition = (index) => {
        const updatedConditions = [...register.medical_conditions];
        updatedConditions.splice(index, 1); // Remove condition at the specified index
        setRegister({ ...register, medical_conditions: updatedConditions });
    };

    const handleDeleteMedication = (index) => {
        const updatedMedications = [...register.medication];
        updatedMedications.splice(index, 1); // Remove medication at the specified index
        setRegister({ ...register, medication: updatedMedications });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const sanitizedRegister = Object.fromEntries(
            Object.entries(register).map(([key, value]) => [key, value === "" ? null : value])
        );
        await addRegisterEntry(pet.$id, sanitizedRegister);
        console.log("Register data:", register)
        setRegister({
        activity_level: "", food: "", substrate: "", water: "", last_feeding: "", temperature: "",
        humidity: "", weight: "", medical_conditions: [], medication: []
        })
        setLoading(false);
        closeModal();
    }
    

    return (
        <div id="modal-bg" className="fixed inset-0 z-2 min-h-screen bg-zinc-700/50 flex justify-center items-center" onClick={closeModalBgClick}>
            <div className="bg-gray-50 p-4 m-4 rounded-lg w-10/12 max-w-screen-md md:w-7/12 shadow-2xl relative">
                <h1 className="text-4xl py-8 font-bold text-center">New register</h1>
                <div className="bg-orange-400 w-4/6 h-1 mx-auto mb-8"></div>
                <form className="px-4 my-3 max-w-3xl mx-auto space-y-3 flex flex-wrap gap-x-7" onSubmit={handleSubmit}>
                    {pet.Type == "Dog" && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Level of activity:</legend>
                        <select name="activity_level"
                            value={register.activity_level}
                            onChange={handleInputChange}
                            className="select">
                            <option disabled={true}>Select:</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </fieldset>}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Brand or type of food:</legend>
                        <input type="text" name="food" value={register.food} onChange={handleInputChange} className="input" placeholder="Type here" />
                    </fieldset>
                    {(pet.Type != "Dog" && pet.Type != "Bird") && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Type of litter or substrate:</legend>
                        <input type="text" name="substrate" value={register.substrate} onChange={handleInputChange} className="input" placeholder="Type here" />
                    </fieldset>}
                    {pet.Type == "Snake" && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Last feeding:</legend>
                        <input type="date" name="last_feeding" value={register.last_feeding || ""} className="input" onChange={handleInputChange} />
                    </fieldset>}
                    {pet.Type == "Fish" && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Type of water:</legend>
                        <select name="water"
                            value={register.water}
                            onChange={handleInputChange}
                            className="select">
                            <option disabled={true}>Select:</option>
                            <option value="Fresh">Freshwater</option>
                            <option value="Salt">Saltwater</option>
                        </select>
                    </fieldset>}
                    {(pet.Type == "Snake" || pet.Type == "Turtle/Lizard/Amphibian" || pet.Type == "Fish" || pet.Type == "Invertebrate") && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Temperature (°C):</legend>
                        <input
                            type="number"
                            name="temperature"
                            value={register.temperature}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="Temperature"
                            step="any"
                        />
                    </fieldset>}
                    {(pet.Type == "Snake" || pet.Type == "Turtle/Lizard/Amphibian" || pet.Type == "Fish" || pet.Type == "Invertebrate") && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Humidity (%):</legend>
                        <input
                            type="number"
                            name="humidity"
                            value={register.humidity}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="Humidity"
                            min="0"
                            max="100"
                            step="any"
                        />
                    </fieldset>}
                    {(pet.Type != "Fish" && pet.Type != "Invertebrate") && <fieldset className="fieldset">
                        <legend className="fieldset-legend">Weight (kg):</legend>
                        <input
                            type="number"
                            name="weight"
                            value={register.weight}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="Weight"
                            step="any"
                        />
                    </fieldset>}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Medical Conditions:</legend>
                        <input
                            type="text"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            className="input"
                            placeholder="Add a medical condition"
                        />
                        <button type="button" onClick={handleAddCondition} className="btn btn-warning">
                            Add Condition
                        </button>
                        <ul>
                            {register.medical_conditions.map((condition, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    {condition}
                                    <button type="button" onClick={() => handleDeleteCondition(index)} className="ml-2 text-red-500">
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Medication:</legend>
                        <input
                            type="text"
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            className="input"
                            placeholder="Add a medication"
                        />
                        <button type="button" onClick={handleAddMedication} className="btn btn-warning">
                            Add Medication
                        </button>
                        <ul>
                            {register.medication.map((medication, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    {medication}
                                    <button type="button" onClick={() => handleDeleteMedication(index)} className="ml-2 text-red-500">
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </fieldset>
                    <div className="mx-0 my-[1em] flex flex-col justify-end">
                        <button type="submit"
                            className=" relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                            Save and submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default RegisterFormModal;
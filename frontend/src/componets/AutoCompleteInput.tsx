import { useState, useRef, useEffect } from "react";

interface AutoCompleteProps {
    label: string;
    options: string[];
    value: string;
    setValue: (val: string) => void;
    disabled?: boolean;
}

const AutoCompleteInput: React.FC<AutoCompleteProps> = ({ label, options, value, setValue }) => {
    const [show, setShow] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = options.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
    );

    // CLOSE WHEN CLICKING OUTSIDE
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setShow(true);
                }}
                onFocus={() => setShow(true)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Type to search…"
            />

            {show && filtered.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-20">
                    {filtered.map((option, idx) => (
                        <li
                            key={idx}
                            onClick={() => {
                                setValue(option);
                                setShow(false);
                            }}
                            className="p-2 hover:bg-indigo-100 cursor-pointer"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoCompleteInput;

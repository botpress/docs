import { useState } from 'react';

export const ContainerToggles = () => {
    const [toggles, setToggles] = useState(Array(4).fill(false));

    const handleToggle = (index) => {
        const newToggles = [...toggles];
        newToggles[index] = !newToggles[index];
        setToggles(newToggles);
    };

    return (
        <div>
            {toggles.map((value, index) => (
                <label key={index} style={{ display: 'block', marginBottom: '10px' }}>
                    Toggle {index + 1}
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleToggle(index)}
                        style={{ marginLeft: '10px' }}
                    />
                </label>
            ))}
        </div>
    );
};
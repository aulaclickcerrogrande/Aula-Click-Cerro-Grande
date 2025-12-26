import React from 'react';

const BrandTitle = ({ text = "Aula Click Cerro Grande", className = "" }) => {
    return (
        <span className={`inline-block whitespace-normal ${className}`}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className={`brand-dynamic brand-letter ${char === ' ' ? 'mr-[0.3em]' : ''}`}
                >
                    {char}
                </span>
            ))}
        </span>
    );
};

export default BrandTitle;

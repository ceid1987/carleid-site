"use client";
import { useState, forwardRef, useEffect, useRef } from "react";
import parsePhoneNumber from "libphonenumber-js";
import { CircleFlag } from "react-circle-flags";
import { lookup } from "country-data-list";
import { cn } from "@/lib/utils";

export type CountryData = {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
};

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCountryChange?: (data: CountryData | undefined) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultCountry?: string;
  className?: string;
}

// All countries with calling codes, sorted once at module load.
const countries: CountryData[] = lookup
  .countries({ status: 'assigned' })
  .filter((country: any) => country.countryCallingCodes && country.countryCallingCodes.length > 0)
  .sort((a: any, b: any) => a.name.localeCompare(b.name));

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onCountryChange,
      onChange,
      value,
      placeholder,
      defaultCountry = "US",
      ...props
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.countryCallingCodes[0].includes(searchQuery)
    );

    // Initialize with default country
    useEffect(() => {
      if (defaultCountry) {
        const country = lookup.countries({ alpha2: defaultCountry.toUpperCase() })[0];
        if (country) {
          setSelectedCountry(country);
        }
      }
    }, [defaultCountry]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
          setSearchQuery('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isDropdownOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isDropdownOpen]);

    const handleCountrySelect = (country: CountryData) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);
      setSearchQuery('');
      onCountryChange?.(country);

      // Update the full phone number
      const fullNumber = phoneNumber ? `${country.countryCallingCodes[0]} ${phoneNumber}` : '';
      const syntheticEvent = {
        target: { value: fullNumber }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = e.target.value;
      setPhoneNumber(number);

      if (selectedCountry && number) {
        try {
          // Parse and validate the phone number
          const fullNumber = `${selectedCountry.countryCallingCodes[0]}${number}`;
          const parsed = parsePhoneNumber(fullNumber);

          if (parsed && parsed.isValid()) {
            setIsValid(true);
            // Use the formatted international number
            const syntheticEvent = {
              ...e,
              target: { ...e.target, value: parsed.formatInternational() }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange?.(syntheticEvent);
          } else {
            setIsValid(false);
            // Still pass the value but it's not valid
            const syntheticEvent = {
              ...e,
              target: { ...e.target, value: fullNumber }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange?.(syntheticEvent);
          }
        } catch (error) {
          setIsValid(false);
          // Fallback to simple concatenation
          const fullNumber = `${selectedCountry.countryCallingCodes[0]} ${number}`;
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: fullNumber }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange?.(syntheticEvent);
        }
      } else {
        setIsValid(null);
        // No country selected or no number
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: number }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    };

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
      setSearchQuery('');
    };

    return (
      <div className={cn("relative", className)}>
        <div className="flex">
          {/* Country Code Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center px-3 py-3 bg-white/[0.03] backdrop-blur-md border border-white/10 border-r-0 rounded-l-lg text-white hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 min-w-[200px] h-full"
            >
              {selectedCountry ? (
                <>
                  <CircleFlag countryCode={selectedCountry.alpha2.toLowerCase()} height={20} width={20} className="mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left truncate">
                    {selectedCountry.name} ({selectedCountry.countryCallingCodes[0]})
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Select country</span>
              )}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-50 w-80 bg-[#0e0e12]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] mt-1 max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-3 border-b border-white/10">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  />
                </div>

                {/* Countries List */}
                <div className="overflow-y-auto max-h-60">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.alpha2}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center px-4 py-3 hover:bg-purple-500/10 text-left text-white transition-colors border-b border-white/[0.06] last:border-b-0"
                      >
                        <CircleFlag countryCode={country.alpha2.toLowerCase()} height={20} width={20} className="mr-3 flex-shrink-0" />
                        <span className="text-sm flex-1">
                          {country.name} ({country.countryCallingCodes[0]})
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-400 text-sm">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="flex-1 relative">
            <input
              ref={ref}
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder={placeholder || "Enter phone number"}
              className={cn(
                "w-full px-4 py-3 bg-white/[0.03] backdrop-blur-md border rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200",
                isValid === true && "border-green-500 focus:ring-green-500",
                isValid === false && "border-red-500 focus:ring-red-500",
                isValid === null && "border-white/10 focus:ring-purple-500/50"
              )}
              {...props}
            />
            {/* Validation indicator */}
            {phoneNumber && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValid === true && (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {isValid === false && (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
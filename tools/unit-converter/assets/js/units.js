// ===== UNIT DEFINITIONS =====

const unitDefinitions = {
    length: {
        name: 'Length',
        units: {
            meter: { name: 'Meter', symbol: 'm', factor: 1 },
            kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000 },
            centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
            millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
            micrometer: { name: 'Micrometer', symbol: 'μm', factor: 0.000001 },
            nanometer: { name: 'Nanometer', symbol: 'nm', factor: 0.000000001 },
            mile: { name: 'Mile', symbol: 'mi', factor: 1609.344 },
            yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
            foot: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
            inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
            nauticalMile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 }
        }
    },
    weight: {
        name: 'Weight',
        units: {
            kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1 },
            gram: { name: 'Gram', symbol: 'g', factor: 0.001 },
            milligram: { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
            metricTon: { name: 'Metric Ton', symbol: 't', factor: 1000 },
            pound: { name: 'Pound', symbol: 'lb', factor: 0.45359237 },
            ounce: { name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
            stone: { name: 'Stone', symbol: 'st', factor: 6.35029318 },
            usTon: { name: 'US Ton', symbol: 'ton', factor: 907.18474 },
            imperialTon: { name: 'Imperial Ton', symbol: 'long ton', factor: 1016.0469088 }
        }
    },
    temperature: {
        name: 'Temperature',
        units: {
            celsius: { name: 'Celsius', symbol: '°C' },
            fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
            kelvin: { name: 'Kelvin', symbol: 'K' }
        },
        // Special conversion functions for temperature
        convert: function(value, fromUnit, toUnit) {
            // Convert to Kelvin first (our base unit for temperature)
            let kelvin;
            
            switch (fromUnit) {
                case 'celsius':
                    kelvin = value + 273.15;
                    break;
                case 'fahrenheit':
                    kelvin = (value + 459.67) * (5/9);
                    break;
                case 'kelvin':
                    kelvin = value;
                    break;
            }
            
            // Convert from Kelvin to target unit
            switch (toUnit) {
                case 'celsius':
                    return kelvin - 273.15;
                case 'fahrenheit':
                    return kelvin * (9/5) - 459.67;
                case 'kelvin':
                    return kelvin;
            }
        },
        // Formula display for temperature conversions
        formula: function(fromUnit, toUnit) {
            switch (fromUnit) {
                case 'celsius':
                    if (toUnit === 'fahrenheit') {
                        return '°F = (°C × 9/5) + 32';
                    } else if (toUnit === 'kelvin') {
                        return 'K = °C + 273.15';
                    }
                    break;
                case 'fahrenheit':
                    if (toUnit === 'celsius') {
                        return '°C = (°F - 32) × 5/9';
                    } else if (toUnit === 'kelvin') {
                        return 'K = (°F + 459.67) × 5/9';
                    }
                    break;
                case 'kelvin':
                    if (toUnit === 'celsius') {
                        return '°C = K - 273.15';
                    } else if (toUnit === 'fahrenheit') {
                        return '°F = K × 9/5 - 459.67';
                    }
                    break;
            }
            return '';
        }
    },
    area: {
        name: 'Area',
        units: {
            squareMeter: { name: 'Square Meter', symbol: 'm²', factor: 1 },
            squareKilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
            squareCentimeter: { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
            squareMillimeter: { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
            squareMile: { name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 },
            squareYard: { name: 'Square Yard', symbol: 'yd²', factor: 0.83612736 },
            squareFoot: { name: 'Square Foot', symbol: 'ft²', factor: 0.09290304 },
            squareInch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
            acre: { name: 'Acre', symbol: 'ac', factor: 4046.8564224 },
            hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 }
        }
    },
    volume: {
        name: 'Volume',
        units: {
            cubicMeter: { name: 'Cubic Meter', symbol: 'm³', factor: 1 },
            liter: { name: 'Liter', symbol: 'L', factor: 0.001 },
            milliliter: { name: 'Milliliter', symbol: 'mL', factor: 0.000001 },
            cubicCentimeter: { name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.000001 },
            cubicFoot: { name: 'Cubic Foot', symbol: 'ft³', factor: 0.028316846592 },
            cubicInch: { name: 'Cubic Inch', symbol: 'in³', factor: 0.000016387064 },
            usGallon: { name: 'US Gallon', symbol: 'gal', factor: 0.003785411784 },
            usQuart: { name: 'US Quart', symbol: 'qt', factor: 0.000946352946 },
            usPint: { name: 'US Pint', symbol: 'pt', factor: 0.000473176473 },
            usFluidOunce: { name: 'US Fluid Ounce', symbol: 'fl oz', factor: 0.0000295735295625 },
            imperialGallon: { name: 'Imperial Gallon', symbol: 'gal (UK)', factor: 0.00454609 },
            imperialQuart: { name: 'Imperial Quart', symbol: 'qt (UK)', factor: 0.0011365225 },
            imperialPint: { name: 'Imperial Pint', symbol: 'pt (UK)', factor: 0.00056826125 },
            imperialFluidOunce: { name: 'Imperial Fluid Ounce', symbol: 'fl oz (UK)', factor: 0.0000284130625 }
        }
    },
    speed: {
        name: 'Speed',
        units: {
            meterPerSecond: { name: 'Meter per Second', symbol: 'm/s', factor: 1 },
            kilometerPerHour: { name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277777778 },
            milePerHour: { name: 'Mile per Hour', symbol: 'mph', factor: 0.44704 },
            footPerSecond: { name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048 },
            knot: { name: 'Knot', symbol: 'kn', factor: 0.514444444 }
        }
    },
    time: {
        name: 'Time',
        units: {
            second: { name: 'Second', symbol: 's', factor: 1 },
            millisecond: { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
            microsecond: { name: 'Microsecond', symbol: 'μs', factor: 0.000001 },
            nanosecond: { name: 'Nanosecond', symbol: 'ns', factor: 0.000000001 },
            minute: { name: 'Minute', symbol: 'min', factor: 60 },
            hour: { name: 'Hour', symbol: 'h', factor: 3600 },
            day: { name: 'Day', symbol: 'd', factor: 86400 },
            week: { name: 'Week', symbol: 'wk', factor: 604800 },
            month: { name: 'Month (avg)', symbol: 'mo', factor: 2629746 },
            year: { name: 'Year', symbol: 'yr', factor: 31556952 }
        }
    },
    pressure: {
        name: 'Pressure',
        units: {
            pascal: { name: 'Pascal', symbol: 'Pa', factor: 1 },
            kilopascal: { name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
            megapascal: { name: 'Megapascal', symbol: 'MPa', factor: 1000000 },
            bar: { name: 'Bar', symbol: 'bar', factor: 100000 },
            psi: { name: 'Pound per Square Inch', symbol: 'psi', factor: 6894.75729 },
            atmosphere: { name: 'Atmosphere', symbol: 'atm', factor: 101325 },
            torr: { name: 'Torr', symbol: 'Torr', factor: 133.322368 },
            millimeterOfMercury: { name: 'Millimeter of Mercury', symbol: 'mmHg', factor: 133.322368 }
        }
    },
    energy: {
        name: 'Energy',
        units: {
            joule: { name: 'Joule', symbol: 'J', factor: 1 },
            kilojoule: { name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
            calorie: { name: 'Calorie', symbol: 'cal', factor: 4.184 },
            kilocalorie: { name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
            watthour: { name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
            kilowatthour: { name: 'Kilowatt-hour', symbol: 'kWh', factor: 3600000 },
            electronvolt: { name: 'Electronvolt', symbol: 'eV', factor: 1.602176634e-19 },
            britishThermalUnit: { name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.05585262 },
            footPound: { name: 'Foot-pound', symbol: 'ft⋅lb', factor: 1.3558179483314 }
        }
    },
    data: {
        name: 'Data',
        units: {
            bit: { name: 'Bit', symbol: 'b', factor: 1 },
            byte: { name: 'Byte', symbol: 'B', factor: 8 },
            kilobit: { name: 'Kilobit', symbol: 'kb', factor: 1000 },
            kilobyte: { name: 'Kilobyte', symbol: 'KB', factor: 8000 },
            megabit: { name: 'Megabit', symbol: 'Mb', factor: 1000000 },
            megabyte: { name: 'Megabyte', symbol: 'MB', factor: 8000000 },
            gigabit: { name: 'Gigabit', symbol: 'Gb', factor: 1000000000 },
            gigabyte: { name: 'Gigabyte', symbol: 'GB', factor: 8000000000 },
            terabit: { name: 'Terabit', symbol: 'Tb', factor: 1000000000000 },
            terabyte: { name: 'Terabyte', symbol: 'TB', factor: 8000000000000 },
            kibibit: { name: 'Kibibit', symbol: 'Kib', factor: 1024 },
            kibibyte: { name: 'Kibibyte', symbol: 'KiB', factor: 8192 },
            mebibit: { name: 'Mebibit', symbol: 'Mib', factor: 1048576 },
            mebibyte: { name: 'Mebibyte', symbol: 'MiB', factor: 8388608 },
            gibibit: { name: 'Gibibit', symbol: 'Gib', factor: 1073741824 },
            gibibyte: { name: 'Gibibyte', symbol: 'GiB', factor: 8589934592 },
            tebibit: { name: 'Tebibit', symbol: 'Tib', factor: 1099511627776 },
            tebibyte: { name: 'Tebibyte', symbol: 'TiB', factor: 8796093022208 }
        }
    }
};

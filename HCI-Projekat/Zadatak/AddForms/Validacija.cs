using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace Zadatak.AddForms
{
    public class ValidacijaOznaka : ValidationRule
    {
        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            try
            {
                var s = value as string;

                if (String.IsNullOrEmpty(s))
                {
                    return new ValidationResult(false, "Polje oznaka mora biti popunjeno!");
                }

                if (!Regex.Match(s, "^[A-Za-z0-9]*$").Success)
                {
                    return new ValidationResult(false, "Oznaka mora biti od slova i brojeva bez razmaka!");
                }

                if (s.Length > 12)
                {
                    return new ValidationResult(false, "Oznaka ne sme biti duza od 12 karaktera!");
                }

                return new ValidationResult(true, null);
            }
            catch
            {
                return new ValidationResult(false, "Greska!");
            }
        }
    }

    public class ValidacijaKapacitet : ValidationRule
    {
        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            try
            {
                var s = value as string;

                if (s.Length > 1 && s[0] == '0')
                {
                    return new ValidationResult(false, "Kapacitet ne moze da pocnje sa 0!");
                }

                foreach (char c in s)
                {
                    if (!Char.IsDigit(c))
                    {
                        return new ValidationResult(false, "Kapacitet mora biti pozitivan ceo broj!");
                    }
                }

                return new ValidationResult(true, null);
            }
            catch
            {
                return new ValidationResult(false, "Greska!");
            }
        }
    }

    public class ValidacijaEmpty : ValidationRule
    {
        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            try
            {
                var s = value as string;

                if (String.IsNullOrEmpty(s))
                {
                    return new ValidationResult(false, "Polje mora biti popunjeno!");
                }

                return new ValidationResult(true, null);
            }
            catch
            {
                return new ValidationResult(false, "Greska!");
            }
        }
    }
 
}



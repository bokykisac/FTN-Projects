using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;

namespace Zadatak.Model
{
    public class Lokal : INotifyPropertyChanged
    {

        #region PropertyChanged
        protected virtual void OnPropertyChanged(string name)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(name));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        #endregion

        private string oznaka;

        public string Oznaka
        {
            get { return oznaka;  }
            set {
                if(oznaka != value)
                {
                    oznaka = value;
                    OnPropertyChanged("Oznaka");

                }
                
            }
        }

        private string tbTip;

        public string TbTip
        {
            get
            {
                if (tip != null)
                {
                    tbTip = tip.Oznaka;
                    return tbTip;
                }
                return "/";
            }
            set
            {
                if (tbTip != value)
                {
                    tbTip = tip.Oznaka;
                    OnPropertyChanged("TbTip");

                }

            }
        }

        private string ime;

        public string Ime
        {
            get { return ime; }
            set
            {
                if (ime != value)
                {
                    ime = value;
                    OnPropertyChanged("Ime");

                }

            }
        }

        private uint kapacitet;

        public uint Kapacitet
        {
            get { return kapacitet; }
            set
            {
                if (kapacitet != value)
                {
                    kapacitet = value;
                    OnPropertyChanged("Kapacitet");

                }

            }
        }

        private string ikonica_path;

        public string IkonicaPath
        {
            get { return ikonica_path; }
            set
            {
                if (ikonica_path != value)
                {
                    ikonica_path = value;
                    OnPropertyChanged("IkonicaPath");

                }

            }
        }

        private ImageSource image;

        public ImageSource Image
        {
            get { return image; }
            set
            {
                if (image != value)
                {
                    image = value;
                    OnPropertyChanged("Image");

                }

            }
        }

        private bool hendikepirane;

        public bool Hendikepirane
        {
            get { return hendikepirane; }
            set
            {
                if (hendikepirane != value)
                {
                    hendikepirane = value;
                    OnPropertyChanged("Hendikepirane");

                }

            }
        }

        private string hendikepirane_string;

        public string Hendikepirane_String
        {
            get { if (hendikepirane)
                    {
                    return "Da";
                    }
                else
                    {
                    return "Ne";
                    }
                }
            set
            {
                hendikepirane_string = value;
            }
        }

        private bool dozvoljeno_pusenje;

        public bool DozvoljenoPusenje
        {
            get { return dozvoljeno_pusenje; }
            set
            {
                if (dozvoljeno_pusenje != value)
                {
                    dozvoljeno_pusenje = value;
                    OnPropertyChanged("DozvoljenoPusenje");

                }

            }
        }

        private string dozvoljeno_pusenje_string;

        public string Dozvoljeno_Pusenje_String
        {
            get
            {
                if (dozvoljeno_pusenje)
                {
                    return "Da";
                }
                else
                {
                    return "Ne";
                }
            }
            set
            {
                dozvoljeno_pusenje_string = value;
            }
        }

        private bool rezervacije;

        public bool Rezervacije
        {
            get { return rezervacije; }
            set
            {
                if (rezervacije != value)
                {
                    rezervacije = value;
                    OnPropertyChanged("Rezervacije");

                }

            }
        }

        private string rezervacije_string;

        public string Rezervacije_String
        {
            get
            {
                if (rezervacije)
                {
                    return "Da";
                }
                else
                {
                    return "Ne";
                }
            }
            set
            {
                rezervacije_string = value;
            }
        }

        private Tip tip;

        public Tip Tip
        {
            get { return tip; }
            set
            {
                if (tip != value)
                {
                    tip = value;
                    OnPropertyChanged("Tip");

                }

            }
        }

        private ObservableCollection<Etiketa> etikete;

        public ObservableCollection<Etiketa> Etikete
        {
            get { return etikete; }
            set
            {
                if (etikete != value)
                {
                    etikete = value;
                    OnPropertyChanged("Etikete");

                }

            }
        }

         private string ispisetiketa_manual;

         public string IspisEtiketa_Manual
         {
             get
             {
                 if (Etikete != null)
                 {
                    ispisetiketa_manual = "";
                     if (Etikete.Count == 0)
                     {
                         return "/";
                     }
                     else
                     {
                         foreach (Etiketa e in Etikete)
                         {
                            ispisetiketa_manual += e.ToString() + ",";
                         }
                         if (!String.IsNullOrEmpty(ispisetiketa_manual))
                         {
                            ispisetiketa_manual = ispisetiketa_manual.Remove(ispisetiketa_manual.Length - 1);
                             return ispisetiketa_manual;
                         }

                         return ispisetiketa_manual;
                     }
                }
                else
                {
                    return "/";
                }               
             }
             set
             {
                 if(ispisetiketa_manual != value)
                 {
                    ispisetiketa_manual = value;
                     OnPropertyChanged("IspisEtiketa");
                 }

             }
         }

        private string ispisetiketa;

        public string IspisEtiketa
        {
            get { return ispisetiketa; }
            set
            {
                if (ispisetiketa != value)
                {
                    ispisetiketa = value;
                    OnPropertyChanged("IspisEtiketa");

                }

            }
        }


        private string ispisitip;
        public string IspisiTip
        {
            get
            {
                if(tip != null)
                {
                    ispisitip = tip.Oznaka;
                    return ispisitip;
                }
                else
                {
                    return "/";
                }
            }
            set
            {
                if(tip != null)
                {
                    ispisitip = value;
                }   
            }
        }

        private string sluzenje_alkohola;

        public string SluzenjeAlkohola
        {
            get { if (!String.IsNullOrEmpty(sluzenje_alkohola))
                    return sluzenje_alkohola;
                else return "/";
                    }
            set { sluzenje_alkohola = value; }
        }

        private string kategorija_cene;

        public string KategorijaCene
        {
            get {if (!String.IsNullOrEmpty(kategorija_cene)) return kategorija_cene;
                else return "/";
            }
            set { kategorija_cene = value; }
        }

        private DateTime date;

        public DateTime Date
        {
            get { return date;  }
            set
            {
                if (date != value)
                {
                    date = value;
                    OnPropertyChanged("Date");

                }

            }
        }

        public string IspisDatum
        {
            get { return date.ToShortDateString(); }
            set { }
        }

        private string opis;

        public string Opis
        {
            get { return opis; }
            set
            {
                if (opis != value)
                {
                    opis = value;
                    OnPropertyChanged("Opis");

                }

            }
        }

        private double x;
        public double X
        {
            get { return x; }
            set { x = value; }
        }

        private double y;
        public double Y
        {
            get { return y; }
            set { y = value; }
        }

        public Lokal(string ozn, string ime, uint kap, ImageSource ico, bool hen, bool pus, bool rez, Tip tip, ObservableCollection<Etiketa> et, string alk, string cena, DateTime datum, string opis, string ikonica_path)
        {
            this.oznaka = ozn;
            this.ime = ime;
            this.kapacitet = kap;
            this.image = ico;
            this.hendikepirane = hen;
            this.dozvoljeno_pusenje = pus;
            this.rezervacije = rez;
            this.tip = tip;
            this.etikete = et;
            this.sluzenje_alkohola = alk;
            this.kategorija_cene = cena;
            this.date = datum;
            this.opis = opis;
            this.ikonica_path = ikonica_path;
        }

        public override string ToString()
        {
            String s ="Oznaka = " + this.oznaka + "\nIme = " + this.ime + "\nKapacitet = " + this.kapacitet + "\nIkonica = " + this.ikonica_path + "\nHendikepirane = " + this.hendikepirane;
            s += "\nPusenje = " + this.dozvoljeno_pusenje + "\nRezervacije = " + this.rezervacije;
            s += "\nAlkohol = " + this.sluzenje_alkohola + "\nKategorija = " + this.kategorija_cene + "\nDatum = " + this.date.ToShortDateString() + "\nOpis = " + this.opis + "\n";

            if (this.tip == null)
            {
                s += "\n\nNema tipa\n";
            }
            else
            {
                s += "\nTip: \n" + this.tip.Ispis();
            }

            s += "\n";

            if (Etikete != null)
            {
                if (this.etikete.Count == 0)
                {
                    s += "\nNema etikete\n";
                }
                else
                {
                    s += "\nEtiketa: \n";
                    foreach (var e in etikete)
                    {
                        s += e.Ispis();
                    }
                }
            }
                       
            return s;
        }

        public string Ispis()
        {
            return "Oznaka = " + this.oznaka + "\nIme = " + this.ime + "\nKapacitet = " + this.kapacitet;
        }

    }
}

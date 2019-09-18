using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace Zadatak.Model
{
    public class Etiketa : INotifyPropertyChanged
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
            get { return oznaka; }
            set
            {
                if (oznaka != value)
                {
                    oznaka = value;
                    OnPropertyChanged("Oznaka");

                }

            }
        }

        private Color boja;

        public Color Boja
        {
            get { return boja;}
            set
            {
                if(boja != value)
                {
                    boja = value;
                    OnPropertyChanged("Boja");
                }
            }
        }

        private string bojatext;

        public String BojaText
        {
            get { return bojatext; }
            set
            {
                if (bojatext != value)
                {
                    bojatext = value;
                    OnPropertyChanged("BojaText");
                }
            }
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

        private string bojahex;

        public String BojaHex
        {
            get { return boja.ToString(); }
            set
            {
                if (bojatext != value)
                {
                    bojatext = value;
                    OnPropertyChanged("BojaText");
                }
            }
        }

        public Etiketa(string oznaka, Color boja, string opis)
        {
            this.oznaka = oznaka;
            this.boja = boja;
            this.opis = opis;
        }

        public override string ToString()
        {
            return this.oznaka;
        }

        public string Ispis()
        {
            return "Oznaka = " + this.oznaka + "\nBoja = " + this.boja.ToString() + "\nOpis = " + this.opis;
        }

    }
}

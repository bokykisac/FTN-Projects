using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace Zadatak.Model
{
    public class Tip : INotifyPropertyChanged
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

        private string ikonicapath;

        public string IkonicaPath
        {
            get { return ikonicapath; }

            set
            {
                if (ikonicapath != value)
                {
                    ikonicapath = value;
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

        public Tip(string oznaka, string ime, ImageSource img, string opis, string imgpath)
        {
            this.oznaka = oznaka;
            this.ime = ime;
            this.image = img;
            this.opis = opis;
            this.ikonicapath = imgpath;
        }

        public override string ToString()
        {
            return this.oznaka;
        }

        public string Ispis()
        {
            return "Oznaka = " + this.oznaka + "\nIme = " + this.ime + "\nImgPath = " + this.ikonicapath + "\nOpis = " + this.opis;
        }
    }
}

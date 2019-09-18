using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zadatak.Model
{
    public class Podaci
    {
        private ObservableCollection<Tip> tipovi = new ObservableCollection<Tip>();
        private ObservableCollection<Etiketa> etikete = new ObservableCollection<Etiketa>();
        private ObservableCollection<Lokal> lokali = new ObservableCollection<Lokal>();

        public ObservableCollection<Tip> Tipovi
        {
            get { return this.tipovi; }
            set { this.tipovi = value; }
        }

        public ObservableCollection<Etiketa> Etikete
        {
            get { return this.etikete; }
            set { this.etikete = value; }
        }

        public ObservableCollection<Lokal> Lokali
        {
            get { return this.lokali; }
            set { this.lokali = value; }
        }

    }
}

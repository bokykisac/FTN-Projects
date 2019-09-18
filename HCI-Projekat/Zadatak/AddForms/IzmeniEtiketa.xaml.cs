using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using Zadatak.Model;

namespace Zadatak.AddForms
{
    /// <summary>
    /// Interaction logic for IzmeniEtiketa.xaml
    /// </summary>
    public partial class IzmeniEtiketa : Window, INotifyPropertyChanged
    {
        private Color boja;
        private string _oznaka;
        private string _opis;
        private MainWindow mw;
        private Etiketa selected;
        private int sel_ind;

        public static RoutedCommand cmdHelp = new RoutedCommand();

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

        #region GetSet
        public Color Boja
        {
            get
            {
                return boja;
            }
            set
            {
                if (boja != value)
                {
                    boja = value;
                    OnPropertyChanged("Boja");
                }
            }
        }

        public string Oznaka
        {
            get
            {
                return _oznaka;
            }
            set
            {
                if (_oznaka != value)
                {
                    _oznaka = value;
                    OnPropertyChanged("Oznaka");
                }
            }
        }

        public string Opis
        {
            get
            {
                return _opis;
            }
            set
            {
                if (_opis != value)
                {
                    _opis = value;
                    OnPropertyChanged("Opis");
                }
            }
        }
        #endregion

        #region Focus
        private void TxtOzn_GotFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderThickness = new Thickness(0, 0, 0, 1.5);
            t.BorderBrush = new SolidColorBrush(Colors.LightBlue);
            lbOzn.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void TxtOzn_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderBrush = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            lbOzn.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            t.BorderBrush.Opacity = 0.5;
            t.BorderThickness = new Thickness(0, 0, 0, 1);
        }

        private void TxtIme_GotFocus(object sender, RoutedEventArgs e)
        {
            lbBoja.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void TxtIme_LostFocus(object sender, RoutedEventArgs e)
        {
            lbBoja.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void TxtOpis_GotFocus(object sender, RoutedEventArgs e)
        {
            lbOpis.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void TxtOpis_LostFocus(object sender, RoutedEventArgs e)
        {
            lbOpis.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }
        #endregion

        public IzmeniEtiketa(Etiketa et, int i, MainWindow w)
        {
            selected = et;
            sel_ind = i;
            mw = w;

            InitializeComponent();
            this.DataContext = this;
            this.Oznaka = selected.Oznaka;
            this.Opis = selected.Opis;
            this.Boja = selected.Boja;

            cmdHelp.InputGestures.Add(new KeyGesture(Key.F1));
            CommandBindings.Add(new CommandBinding(cmdHelp, izbaciHelp));
        }

        private void izbaciHelp(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start(System.IO.Path.GetFullPath(@"..\..\Help.chm"));
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Izmeni();
            mw.Pod.Etikete[sel_ind] = selected;

            foreach (Lokal l in mw.Pod.Lokali.ToList())
            {
                foreach (Etiketa et in l.Etikete)
                {
                    if(et.Oznaka == selected.Oznaka)
                    {
                        et.Boja = selected.Boja;
                        et.Opis = selected.Opis;
                        et.BojaText = cp.SelectedColorText;
                    }
                }
            }

            mw.dgEtikete.Items.Refresh();
            this.Close();
        }

        private void Izmeni()
        {
            selected.Oznaka = Oznaka;
            selected.Boja = Boja;
            selected.Opis = Opis;
            selected.BojaText = cp.SelectedColorText;
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}

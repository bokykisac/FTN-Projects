using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
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
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class AddLokal : Window, INotifyPropertyChanged
    {

        private string _oznaka;
        private string _ime;
        private string _kapacitet;
        private string _ikonicaPath;
        private DateTime _date = DateTime.Now;
        private string _opis;
        private MainWindow mw;
        private ObservableCollection<Tip> tipovi;
        private ObservableCollection<Etiketa> etikete;
        private string _etiketeString;

        public static RoutedCommand cmdHelp = new RoutedCommand();

        #region Bindings

        public string EtiketeString
        {
            get
            {
                return _etiketeString;
            }
            set
            {
                if (_etiketeString != value)
                {
                    _etiketeString = value;
                    OnPropertyChanged("EtiketeString");
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

        public DateTime Date
        {
            get
            {
                return _date;
            }
            set
            {
                if(_date != value)
                {
                    _date = value;
                    OnPropertyChanged("Date");
                }
            }
        } 

        public bool Hendikepirane
        {
            get;
            set;
        }

        public bool Pusenje
        {
            get;
            set;
        }

        public bool Rezervacije
        {
            get;
            set;
        }

        public ObservableCollection<Tip> Tip
        {
            get;
            set;
        }

        public ObservableCollection<Etiketa> Etiketa
        {
            get;
            set;
        }

        public ObservableCollection<string> SluzenjeAlkohola
        {
            get;
            set;
        }

        public ObservableCollection<string> KategorijaCene
        {
            get;
            set;
        }

        public string Oznaka
        {
            get
            {
                return _oznaka;
            }
            set
            {
                if(value != _oznaka)
                {
                    _oznaka = value;
                    OnPropertyChanged("Oznaka");
                }
            }
        }

        public string Ime
        {
            get
            {
                return _ime;
            }
            set
            {
                if (value != _ime)
                {
                    _ime = value;
                    OnPropertyChanged("Ime");
                }
            }
        }

        public string IkonicaPath
        {
            get
            {
                return _ikonicaPath;
            }
            set
            {
                if (value != _ikonicaPath)
                {
                    _ikonicaPath = value;
                    OnPropertyChanged("IkonicaPath");
                }
            }
        }

        public string Kapacitet
        {
            get
            {
                return _kapacitet;
            }
            set
            {
                if (value != _kapacitet)
                {
                    _kapacitet = value;
                    OnPropertyChanged("Kapacitet");
                }
            }
        }
        #endregion

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

        public AddLokal(MainWindow w)
        {
            
            Init(w);
            InitializeComponent();
            this.DataContext = this;

            cmdHelp.InputGestures.Add(new KeyGesture(Key.F1));
            CommandBindings.Add(new CommandBinding(cmdHelp, izbaciHelp));

        }

        private void izbaciHelp(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start(System.IO.Path.GetFullPath(@"..\..\Help.chm"));
        }



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
            TextBox t = (TextBox)sender;
            t.BorderThickness = new Thickness(0, 0, 0, 1.5);
            t.BorderBrush = new SolidColorBrush(Colors.LightBlue);
            lbIme.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void TxtIme_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderBrush = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            lbIme.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            t.BorderBrush.Opacity = 0.5;
            t.BorderThickness = new Thickness(0, 0, 0, 1);
        }

        private void TxtKap_GotFocus(object sender, RoutedEventArgs e)
        {
                TextBox t = (TextBox)sender;
                t.BorderThickness = new Thickness(0, 0, 0, 1.5);
                t.BorderBrush = new SolidColorBrush(Colors.LightBlue);
                lbKap.Foreground = new SolidColorBrush(Colors.LightBlue); 
        }

        private void TxtKap_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderBrush = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            lbKap.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            t.BorderBrush.Opacity = 0.5;
            t.BorderThickness = new Thickness(0, 0, 0, 1);
        }

        private void TxtIcon_GotFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderThickness = new Thickness(0, 0, 0, 1.5);
            t.BorderBrush = new SolidColorBrush(Colors.LightBlue);
            lbIcon.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void TxtIcon_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderBrush = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            lbIcon.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            t.BorderBrush.Opacity = 0.5;
            t.BorderThickness = new Thickness(0, 0, 0, 1);
        }

        private void CbTip_GotFocus(object sender, RoutedEventArgs e)
        {
            lbTip.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CbTip_LostFocus(object sender, RoutedEventArgs e)
        {
            lbTip.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void CpAlkohol_GotFocus(object sender, RoutedEventArgs e)
        {
            lbAlkohol.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CpAlkohol_LostFocus(object sender, RoutedEventArgs e)
        {
            lbAlkohol.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void CbCena_GotFocus(object sender, RoutedEventArgs e)
        {
            lbCena.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CbCena_LostFocus(object sender, RoutedEventArgs e)
        {
            lbCena.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void DDate_LostFocus(object sender, RoutedEventArgs e)
        {
            lbDate.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void TxtOpis_GotFocus(object sender, RoutedEventArgs e)
        {
            lbOpis.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void TxtOpis_LostFocus(object sender, RoutedEventArgs e)
        {
            lbOpis.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void CheckboxHend_GotFocus(object sender, RoutedEventArgs e)
        {
            lbHend.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CheckboxHend_LostFocus(object sender, RoutedEventArgs e)
        {
            lbHend.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void CustomWatermarkedDatePicker_GotKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e)
        {
            lbDate.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CheckboxPusenje_GotFocus(object sender, RoutedEventArgs e)
        {
            lbPusenje.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CheckboxPusenje_LostFocus(object sender, RoutedEventArgs e)
        {
            lbPusenje.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void CheckboxRezervacija_GotFocus(object sender, RoutedEventArgs e)
        {
            lbRezervacija.Foreground = new SolidColorBrush(Colors.LightBlue);
        }

        private void CheckboxRezervacija_LostFocus(object sender, RoutedEventArgs e)
        {
            lbRezervacija.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }


        #endregion

        #region ButtonClicks

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            OpenFileDialog opd = new OpenFileDialog();
            opd.DefaultExt = ".ico";
            opd.Filter ="JPG files (*.jpg)|*.jpg|PNG files(*.png)|*.png";
            Nullable<bool> dialogOk = opd.ShowDialog();

            if(dialogOk == true)
            {
                string filePath = opd.FileName;
                txtIcon.Text = filePath;

                FileInfo fi = new FileInfo(filePath);
                string extn = fi.Extension;
                Uri myUri = new Uri(filePath, UriKind.RelativeOrAbsolute);

                if (extn.Equals(".jpg"))
                {
                    JpegBitmapDecoder decoder2 = new JpegBitmapDecoder(myUri, BitmapCreateOptions.PreservePixelFormat, BitmapCacheOption.Default);
                    BitmapSource bitmapSource2 = decoder2.Frames[0];
                    imgIcon.Source = bitmapSource2;
                }
                else if (extn.Equals(".png"))
                {
                    PngBitmapDecoder decoder2 = new PngBitmapDecoder(myUri, BitmapCreateOptions.PreservePixelFormat, BitmapCacheOption.Default);
                    BitmapSource bitmapSource2 = decoder2.Frames[0];
                    imgIcon.Source = bitmapSource2;
                }
                else
                {
                    imgIcon.Source = null;
                }
    
            }
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            ImageSource img;

            uint kap = 0;
            UInt32.TryParse(_kapacitet, out kap);

            Tip t = (Tip)cbTip.SelectedItem;

            var listEt = cbEtiketa.SelectedItems;
            ObservableCollection<Etiketa> et = new ObservableCollection<Etiketa>();
            for (int i = 0; i < cbEtiketa.SelectedItems.Count; i++)
            {
                Etiketa etik = (Etiketa)listEt[i];
                et.Add(etik);             
            }

            String alk = (String)cpAlkohol.SelectedItem;

            String c = (String)cbCena.SelectedItem;

            if (!String.IsNullOrEmpty(_ikonicaPath))
            {
                Uri path = new Uri(_ikonicaPath);
                img = new BitmapImage(path);
            }
            else if(t != null)
            {
                img = t.Image;
                _ikonicaPath = t.IkonicaPath;
            }
            else
            {
                img = null;
            }

            if (String.IsNullOrEmpty(txtOzn.Text))
            {
                MessageBox.Show("Oznaka lokala ne sme biti prazna!");
                txtOzn.Focus();
            }
            else if (!Regex.Match(txtOzn.Text, "^[A-Za-z0-9]*$").Success)
            {
                MessageBox.Show("Oznaka mora biti od slova i brojeva bez razmaka!");
                txtOzn.Focus();
            }
            else if (txtOzn.Text.Length > 12)
            {
                MessageBox.Show("Oznaka ne sme biti duza od 12 karaktera!");
                txtOzn.Focus();
            }
            else if (String.IsNullOrEmpty(txtIme.Text))
            {
                MessageBox.Show("Ime lokala ne sme biti prazno!");
                txtIme.Focus();
            }
            else if (txtKap.Text.Length > 1 && txtKap.Text[0] == '0')
            {
                MessageBox.Show("Kapacitet ne moze da pocnje sa 0!");
                txtKap.Focus();
            }
            else if (!String.IsNullOrEmpty(txtKap.Text) &&  (txtKap.Text[0] ==  '-' || txtKap.Text[0] == '+'))
            {
                MessageBox.Show("Kapacitet mora biti pozitivan ceo broj!");
                txtKap.Focus();

            }
            else if (!String.IsNullOrEmpty(txtKap.Text) && !UInt32.TryParse(txtKap.Text, out kap))
            {
                MessageBox.Show("Kapacitet mora biti pozitivan ceo broj!");
                txtKap.Focus();
            }
            else if (cbTip.SelectedItem == null)
            {
                MessageBox.Show("Morate odabrati tip lokala!");
                cbTip.Focus();
            }
            else
            {
                foreach (Lokal lok in mw.Pod.Lokali)
                {
                    if(lok.Oznaka == this.Oznaka)
                    {
                        MessageBox.Show("Lokal sa oznakom " + this.Oznaka + " vec postoji!");
                        return;
                    }
                }

                EtiketeString = cbEtiketa.Text;

                Lokal l = new Lokal(_oznaka, _ime, kap, img, Hendikepirane, Pusenje, Rezervacije, t, et, alk, c, _date, _opis, _ikonicaPath);
                l.IspisEtiketa = EtiketeString;
                mw.Pod.Lokali.Add(l);                       
                Clear();
                mw.prikaziLokale();
                mw.dgTabela.SelectedIndex = -1;
                this.Close();
            }



        }
        #endregion

        private void Clear()
        {
            txtOzn.Clear();
            txtIme.Clear();
            txtIcon.Clear();
            txtKap.Clear();
            imgIcon.Source = null;
            checkboxHend.IsChecked = false;
            checkboxPusenje.IsChecked = false;
            checkboxRezervacija.IsChecked = false;
            cbTip.SelectedIndex = -1;
            cpAlkohol.SelectedIndex = -1;
            cbCena.SelectedIndex = -1;
            cbEtiketa.UnSelectAll();
            DatumPolje.SelectedDate = DateTime.Now;
            txtOpis.Clear();
        }

        private void Init(MainWindow w)
        {
            CultureInfo ci = CultureInfo.CreateSpecificCulture(CultureInfo.CurrentCulture.Name);
            ci.DateTimeFormat.ShortDatePattern = "dd-MM-yyyy";
            Thread.CurrentThread.CurrentCulture = ci;

            mw = w;
            tipovi = mw.Pod.Tipovi;
            etikete = mw.Pod.Etikete;

            Tip = new ObservableCollection<Tip>();
            foreach (Tip t in tipovi)
            {
                Tip.Add(t);
            }

            Etiketa = new ObservableCollection<Etiketa>();
            foreach (Etiketa e in etikete)
            {
                Etiketa.Add(e);
            }

            SluzenjeAlkohola = new ObservableCollection<string>();
            SluzenjeAlkohola.Add("Ne sluzi");
            SluzenjeAlkohola.Add("Sluzi do 23:00");
            SluzenjeAlkohola.Add("Sluzi i kasno nocu");

            KategorijaCene = new ObservableCollection<string>();
            KategorijaCene.Add("Niske cene");
            KategorijaCene.Add("Srednje cene");
            KategorijaCene.Add("Visoke cene");
            KategorijaCene.Add("Izuzetno visoke cene");
        }
    }
}

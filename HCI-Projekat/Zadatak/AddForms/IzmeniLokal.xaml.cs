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
    /// Interaction logic for IzmeniLokal.xaml
    /// </summary>
    public partial class IzmeniLokal : Window, INotifyPropertyChanged
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
        private int index;
        private Lokal selected;
        public static RoutedCommand cmdHelp = new RoutedCommand();
        private string ID;

        #region Bindings

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
                if (_date != value)
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
                if (value != _oznaka)
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
        private string _katCene;

        public string KatCene
        {
            get
            {
                return _katCene;
            }
            set
            {
                if (value != _katCene)
                {
                    _katCene = value;
                    OnPropertyChanged("KatCene");
                }
            }
        }

        private string _sluziAlk;

        public string SluziAlk
        {
            get
            {
                return _sluziAlk;
            }
            set
            {
                if (value != _sluziAlk)
                {
                    _sluziAlk = value;
                    OnPropertyChanged("SluziAlk");
                }
            }
        }

        private Tip _selektTip;

        public Tip SelektTip
        {
            get
            {
                return _selektTip;
            }
            set
            {
                if (value != _selektTip)
                {
                    _selektTip = value;
                    OnPropertyChanged("SelektTip");
                }
            }
        }


        #endregion

        

        public IzmeniLokal(Lokal l, int i, MainWindow w)
        {
            ID = l.Oznaka;
            selected = l;
            index = i;
            mw = w;

            init(w);
            InitializeComponent();
            this.DataContext = this;

            this.Ime = selected.Ime;
            this.Oznaka = selected.Oznaka;
            this.Kapacitet = selected.Kapacitet.ToString();
            this.IkonicaPath = selected.IkonicaPath;
            imgIcon.Source = selected.Image;
            this.Hendikepirane = selected.Hendikepirane;
            this.Pusenje = selected.DozvoljenoPusenje;
            this.Rezervacije = selected.Rezervacije;
            this.Date = selected.Date;
            this.Opis = selected.Opis;
            this.KatCene = selected.KategorijaCene;
            this.SluziAlk = selected.SluzenjeAlkohola;
            this.SelektTip = selected.Tip;
            cbEtiketa.SelectedItemsOverride = l.Etikete;

            cmdHelp.InputGestures.Add(new KeyGesture(Key.F1));
            CommandBindings.Add(new CommandBinding(cmdHelp, izbaciHelp));

        }

        private void izbaciHelp(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start(System.IO.Path.GetFullPath(@"..\..\Help.chm"));
        }

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

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
        #endregion

        #region Clicks
        private void Odaberi_Sliku_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog opd = new OpenFileDialog();
            opd.DefaultExt = ".ico";
            opd.Filter = "JPG files (*.jpg)|*.jpg|PNG files(*.png)|*.png";
            Nullable<bool> dialogOk = opd.ShowDialog();

            if (dialogOk == true)
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
        #endregion

        private void BtnPotvrdi_Click(object sender, RoutedEventArgs e)
        {
            ImageSource img;

            uint kap = 0;
            UInt32.TryParse(_kapacitet, out kap);
            selected.Kapacitet = kap;

            Tip t = (Tip)cbTip.SelectedItem;

            if (!String.IsNullOrEmpty(_ikonicaPath))
            {
                Uri path = new Uri(_ikonicaPath);
                img = new BitmapImage(path);
            }
            else if (t != null)
            {
                img = t.Image;
            }
            else
            {
                img = null;
            }

            var listEt = cbEtiketa.SelectedItems;
            ObservableCollection<Etiketa> et = new ObservableCollection<Etiketa>();
            for (int i = 0; i < cbEtiketa.SelectedItems.Count; i++)
            {
                Etiketa etik = (Etiketa)listEt[i];
                et.Add(etik);
            }


            if (provera())
            {
                selected.Ime = _ime;
                selected.IkonicaPath = _ikonicaPath;
                selected.Image = img;
                selected.Hendikepirane = Hendikepirane;
                selected.DozvoljenoPusenje = Pusenje;
                selected.Rezervacije = Rezervacije;
                selected.Date = _date;
                selected.Opis = _opis;
                selected.KategorijaCene = _katCene;
                selected.SluzenjeAlkohola = _sluziAlk;
                selected.Tip = t;
                selected.Etikete = et;
                selected.IspisEtiketa = cbEtiketa.Text;

                foreach  (Lokal l  in mw.Pod.Lokali)
                {
                    if(l.Oznaka == ID)
                    {
                        l.Ime = selected.Ime;
                        l.IkonicaPath = selected.IkonicaPath;
                        l.Image = selected.Image;
                        l.Hendikepirane = selected.Hendikepirane;
                        l.DozvoljenoPusenje = selected.DozvoljenoPusenje;
                        l.Rezervacije = selected.Rezervacije;
                        l.Date = selected.Date;
                        l.Opis = selected.Opis;
                        l.KategorijaCene = selected.KategorijaCene;
                        l.SluzenjeAlkohola = selected.SluzenjeAlkohola;
                        l.Tip = selected.Tip;
                        l.Etikete = selected.Etikete;
                        l.IspisEtiketa = selected.IspisEtiketa;
                    }
                }
                mw.dgTabela.Items.Refresh();
                this.Close();
            }
            else
            {
                return;
            }

           
        }

        private bool provera()
        {
            if (String.IsNullOrEmpty(txtOzn.Text))
            {
                MessageBox.Show("Oznaka lokala ne sme biti prazna!");
                txtOzn.Focus();
                return false;
            }
            else if (!Regex.Match(txtOzn.Text, "^[A-Za-z0-9]*$").Success)
            {
                MessageBox.Show("Oznaka mora biti od slova i brojeva bez razmaka!");
                txtOzn.Focus();
                return false;
            }
            else if (txtOzn.Text.Length > 12)
            {
                MessageBox.Show("Oznaka ne sme biti duza od 12 karaktera!");
                txtOzn.Focus();
                return false;
            }
            else if (String.IsNullOrEmpty(txtIme.Text))
            {
                MessageBox.Show("Ime lokala ne sme biti prazno!");
                txtIme.Focus();
                return false;
            }
            else if (txtKap.Text.Length > 1 && txtKap.Text[0] == '0')
            {
                MessageBox.Show("Kapacitet ne moze da pocnje sa 0!");
                txtKap.Focus();
                return false;
            }
            else if (!String.IsNullOrEmpty(txtKap.Text) && (txtKap.Text[0] == '-' || txtKap.Text[0] == '+'))
            {
                MessageBox.Show("Kapacitet mora biti pozitivan ceo broj!");
                txtKap.Focus();
                return false;

            }
            else if (!String.IsNullOrEmpty(txtKap.Text) && !UInt32.TryParse(txtKap.Text, out uint kap))
            {
                MessageBox.Show("Kapacitet mora biti pozitivan ceo broj!");
                txtKap.Focus();
                return false;
            }
            else if (cbTip.SelectedItem == null)
            {
                MessageBox.Show("Morate odabrati tip lokala!");
                cbTip.Focus();
                return false;
            }

            return true;
        }

        private void init(MainWindow w)
        {
            CultureInfo ci = CultureInfo.CreateSpecificCulture(CultureInfo.CurrentCulture.Name);
            ci.DateTimeFormat.ShortDatePattern = "dd-MM-yyyy";
            Thread.CurrentThread.CurrentCulture = ci;

            KategorijaCene = new ObservableCollection<string>();
            KategorijaCene.Add("Niske cene");
            KategorijaCene.Add("Srednje cene");
            KategorijaCene.Add("Visoke cene");
            KategorijaCene.Add("Izuzetno visoke cene");

            SluzenjeAlkohola = new ObservableCollection<string>();
            SluzenjeAlkohola.Add("Ne sluzi");
            SluzenjeAlkohola.Add("Sluzi do 23:00");
            SluzenjeAlkohola.Add("Sluzi i kasno nocu");

            Tip = new ObservableCollection<Tip>();
            foreach (Tip t in mw.Pod.Tipovi)
            {
                Tip.Add(t);
            }

            Etiketa = new ObservableCollection<Etiketa>();
            foreach (Etiketa e in mw.Pod.Etikete)
            {
                Etiketa.Add(e);
            }
        }
    }
}

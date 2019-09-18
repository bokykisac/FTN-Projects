using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
    /// Interaction logic for AddTip.xaml
    /// </summary>
    public partial class AddTip : Window, INotifyPropertyChanged
    {

        private string _oznaka;
        private string _ime;
        private string _ikonicaPath;
        private string _opis;
        private MainWindow mw;

        public static RoutedCommand cmdHelp = new RoutedCommand();


        #region Bindings

        public string Oznaka
        {
            get
            {
                return _oznaka;
            }
            set
            {
                if(_oznaka != value)
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
                if (_ime != value)
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
                if (_ikonicaPath != value)
                {
                    _ikonicaPath = value;
                    OnPropertyChanged("IkonicaPath");
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

        public AddTip(MainWindow w)
        {
            mw = w;
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

        private void TxtIcon_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox t = (TextBox)sender;
            t.BorderBrush = new SolidColorBrush(Color.FromRgb(212, 212, 212));
            lbIcon.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
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

        private void TxtOpis_LostFocus(object sender, RoutedEventArgs e)
        {
            lbOpis.Foreground = new SolidColorBrush(Color.FromRgb(212, 212, 212));
        }

        private void TxtOpis_GotFocus(object sender, RoutedEventArgs e)
        {
            lbOpis.Foreground = new SolidColorBrush(Colors.LightBlue);
        }
        #endregion

        #region Click

        private void Button_Click_1(object sender, RoutedEventArgs e)
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

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {

            ImageSource img;

            if (!String.IsNullOrEmpty(_ikonicaPath))
            {
                Uri path = new Uri(_ikonicaPath);
                img = new BitmapImage(path);
            }
            else
            {
                img = null;
            }

            if (String.IsNullOrEmpty(txtOzn.Text))
            {
                MessageBox.Show("Oznaka tipa ne sme biti prazna!");
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
                MessageBox.Show("Morate uneti ime tipa!");
                txtIme.Focus();
            }
            else if (String.IsNullOrEmpty(IkonicaPath))
            {
                MessageBox.Show("Morate uneti sliku tipa!");
                txtIcon.Focus();
            }
            else
            {
                foreach (Tip tp in mw.Pod.Tipovi)
                {
                    if (tp.Oznaka == this.Oznaka)
                    {
                        MessageBox.Show("Tip sa oznakom " + this.Oznaka + " vec postoji!");
                        return;
                    }
                }

                Tip t = new Tip(_oznaka, _ime, img, _opis, _ikonicaPath);
                mw.Pod.Tipovi.Add(t);
                Clear();

                mw.prikaziTipove();
                mw.dgTipovi.SelectedIndex = -1;
                this.Close();
            }



        }
        #endregion

        private void Clear()
        {
            txtIcon.Clear();
            txtIme.Clear();
            txtOzn.Clear();
            txtOpis.Clear();
            imgIcon.Source = null;
        }
    }
}

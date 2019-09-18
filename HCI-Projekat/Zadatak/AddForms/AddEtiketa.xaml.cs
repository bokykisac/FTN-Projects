using System;
using System.Collections.Generic;
using System.ComponentModel;
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
    /// Interaction logic for AddEtiketa.xaml
    /// </summary>
    public partial class AddEtiketa : Window, INotifyPropertyChanged
    {

        private Color boja;
        private string _oznaka;
        private string _opis;
        private MainWindow mw;

        public static RoutedCommand cmdHelp = new RoutedCommand();

        #region GetSet
        public Color Boja
        {
            get
            {
                return boja;
            }
            set
            {
                boja = value;
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

        public AddEtiketa(MainWindow w)
        {
            mw = w;
            InitializeComponent();
            this.DataContext = this;


            cmdHelp.InputGestures.Add(new KeyGesture(Key.F1));
            CommandBindings.Add(new CommandBinding(cmdHelp, izbaciHelp));
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

        private void izbaciHelp(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start(System.IO.Path.GetFullPath(@"..\..\Help.chm"));
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void Cp_SelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            if (cp.SelectedColor.HasValue)
            {
                boja = cp.SelectedColor.Value;
                byte Red = boja.R;
                byte Green = boja.G;
                byte Blue = boja.B;
                //long colorVal = Convert.ToInt64(Blue * (Math.Pow(256, 0)) + Green * (Math.Pow(256, 1)) + Red * (Math.Pow(256, 2)));
            }
            else
            {
                boja = new Color();
            }
       
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {

            if (String.IsNullOrEmpty(txtOzn.Text))
            {
                MessageBox.Show("Oznaka etikete ne sme biti prazna!");
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
            else
            {
                foreach (Etiketa etik in mw.Pod.Etikete) 
                {
                    if(etik.Oznaka == this.Oznaka)
                    {
                        MessageBox.Show("Etiketa sa oznakom " + this.Oznaka + " vec postoji!");
                        return;
                    }
                }

                Etiketa et = new Etiketa(_oznaka, boja, _opis);
                et.BojaText = cp.SelectedColorText;
                mw.Pod.Etikete.Add(et);

                txtOzn.Clear();
                txtOpis.Clear();
                cp.SelectedColor = null;

                mw.prikaziEtikete();
                mw.dgEtikete.SelectedIndex = -1;
                this.Close();
            }
        }
    }
}

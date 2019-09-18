using System;
using System.Collections.Generic;
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
using System.Windows.Navigation;
using System.Windows.Shapes;
using Zadatak.Login;
using System.ComponentModel;
using System.Collections.ObjectModel;
using System.Runtime.CompilerServices;
using Zadatak.AddForms;
using Zadatak.Model;
using Microsoft.Win32;
using System.IO;
using Newtonsoft.Json;

namespace Zadatak
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window, INotifyPropertyChanged
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

        private Podaci noviPodaci;     
        public Podaci NoviPodaci
        {
            get { return this.noviPodaci; }
            set { this.noviPodaci = value; }
        }

        private string _pretraga;
        public string Pretraga
        {
            get
            {
                return _pretraga;
            }
            set
            {
                if (_pretraga != value)
                {
                    _pretraga = value;
                    OnPropertyChanged("Pretraga");
                }
            }
        }

        private Podaci pod = new Podaci();
        public Podaci Pod
        {
            get
            {
                return this.pod;
            }
            set
            {   if(value != pod)
                {
                    this.pod = value;
                    OnPropertyChanged("Pod");
                }
                
            }
        }

        public ObservableCollection<string> Prikaz
        {
            get;
            set;
        }

        public ObservableCollection<Lokal> FilterLokali
        {
            get;
            set;
        }

        public ObservableCollection<Lokal> LokaliSearch
        {
            get;
            set;
        }


        Point startPoint = new Point();

        public ObservableCollection<Lokal> Lokali_mapa
        {
            get;
            set;
        }

        public static RoutedCommand cmdDodajLokal = new RoutedCommand();
        public static RoutedCommand cmdDodajTip = new RoutedCommand();
        public static RoutedCommand cmdDodajEtiketu = new RoutedCommand();
        public static RoutedCommand cmdOpen = new RoutedCommand();
        public static RoutedCommand cmdSave = new RoutedCommand();
        public static RoutedCommand cmdOdjava = new RoutedCommand();
        public static RoutedCommand cmdPrikaziLokale = new RoutedCommand();
        public static RoutedCommand cmdPrikazeEtikete = new RoutedCommand();
        public static RoutedCommand cmdPrikazeTipove = new RoutedCommand();
        public static RoutedCommand cmdHelp = new RoutedCommand();


        public MainWindow(User u)
        {        
            InitializeComponent();
            initCommands();
            this.DataContext = this;

            lbUser.Content = u.Username;

            Lokali_mapa = new ObservableCollection<Lokal>();

            Prikaz = new ObservableCollection<string>();
            Prikaz.Add("Svemu");
            Prikaz.Add("Hendikepirane");
            Prikaz.Add("Pusenju");
            Prikaz.Add("Rezervaciji");
            cbFilter.SelectedIndex = 0;
        }
        #region Forme

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            AddLokal w = new AddLokal(this);
            w.Owner = this;
            w.ShowDialog();
        }


        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            AddTip t = new AddTip(this);
            t.Owner = this;
            t.ShowDialog();
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            AddEtiketa et = new AddEtiketa(this);
            et.Owner = this;
            et.ShowDialog();
        }
       
        #endregion

        private void BtnIzmeniLokal_Click(object sender, RoutedEventArgs e)
        {
            int index;
            foreach (Lokal l in Pod.Lokali.ToList())
            {
                if(l.Oznaka == (String)lokOznaka.Text)
                {
                    index = dgTabela.SelectedIndex;
                    IzmeniLokal il = new IzmeniLokal(l, index, this);
                    il.Owner = this;
                    il.ShowDialog();
                    return;
                }
            }
        }

        private void BtnIzmeniTip_Click(object sender, RoutedEventArgs e)
        {
            int index;
            foreach (Tip tip in Pod.Tipovi.ToList())
            {
                if(tip.Oznaka == tipOznaka.Text)
                {
                    index = dgTipovi.SelectedIndex;
                    IzmeniTip it = new IzmeniTip(tip, index, this);
                    it.Owner = this;
                    it.ShowDialog();
                    return;
                }
            }

        }

        private void BtnIzmeniEtiketu_Click(object sender, RoutedEventArgs e)
        {
            int index;
            foreach (Etiketa et in Pod.Etikete.ToList())
            {
                if (et.Oznaka == etOznaka.Text)
                {
                    index = dgEtikete.SelectedIndex;
                    IzmeniEtiketa it = new IzmeniEtiketa(et, index, this);
                    it.Owner = this;
                    it.ShowDialog();
                    return;
                }
            }

        }

        private void Lokali_Prikazi_Click(object sender, RoutedEventArgs e)
        {
            prikaziLokale();
            dgTabela.SelectedIndex = -1;
            btnLokali.Background = new SolidColorBrush(Color.FromRgb(73, 73, 73));
            btnEtikete.Background = new SolidColorBrush(Color.FromRgb(110, 110, 110));
            btnTipovi.Background = new SolidColorBrush(Color.FromRgb(110, 110, 110));
        }

        private void Tipovi_Prikazi_Click(object sender, RoutedEventArgs e)
        {
            prikaziTipove();
            dgTipovi.SelectedIndex = -1;
            btnLokali.Background = new SolidColorBrush(Color.FromRgb(110, 110, 110));
            btnEtikete.Background = new SolidColorBrush(Color.FromRgb(110, 110, 110));
            btnTipovi.Background = new SolidColorBrush(Color.FromRgb(73, 73, 73));

        }

        private void Etikete_Prikazi_Click(object sender, RoutedEventArgs e)
        {
            prikaziEtikete();
            dgEtikete.SelectedIndex = -1;
            btnLokali.Background = new SolidColorBrush(Color.FromRgb(110, 110, 110));
            btnEtikete.Background = new SolidColorBrush(Color.FromRgb(73, 73, 73));
            btnTipovi.Background = new SolidColorBrush(Color.FromRgb(110, 110, 110));
        }

        private void BtnIzbrisiLokal_Click(object sender, RoutedEventArgs e)
        {
            string oznaka = lokOznaka.Text;

            foreach (Lokal l in Pod.Lokali.ToList())
            {
                if (l.Oznaka == lokOznaka.Text)
                {
                    Pod.Lokali.Remove(l);
                    dgTabela.SelectedIndex = -1;

                    if(LokaliSearch != null)
                    {
                        LokaliSearch.Remove(l);
                    }

                    if(FilterLokali != null)
                    {
                        FilterLokali.Remove(l);
                    }
                    

                    if(Lokali_mapa.Count > 0)
                    {
                        
                        foreach (Lokal mapLok in Lokali_mapa.ToList())
                        {
                            if (mapLok.Oznaka == oznaka)
                            {
                                UIElement obrisi = null;
                                Lokali_mapa.Remove(mapLok);
                                Image lokImage = new Image();
                                lokImage.Source = mapLok.Image;

                                foreach (UIElement child in canvasMap.Children)
                                {
                                    
                                    Image mapImage = child as Image;   
                                    if (lokImage.Source == mapImage.Source)
                                    {
                                        obrisi = child;
                                    }
                                }

                                if(obrisi != null)
                                {
                                    canvasMap.Children.Remove(obrisi);
                                }
                            }
                        }
                    }

                    dgTabela.Items.Refresh();
                    Pretraga = "";

                }
            }
        }

        private void BtnIzbrisiTip_Click(object sender, RoutedEventArgs e)
        {
            string selektovanTip = tipOznaka.Text;

            if (Pod.Lokali.Count == 0)
            {
                foreach (Tip t in Pod.Tipovi.ToList())
                {
                    if(selektovanTip == t.Oznaka)
                    {
                        Pod.Tipovi.Remove(t);
                        dgTipovi.SelectedIndex = -1;
                        dgTipovi.Items.Refresh();
                    }
                }
            }
            else
            {
                foreach (Lokal lok in Pod.Lokali)
                {
                    if (selektovanTip == lok.Tip.Oznaka)
                    {
                        MessageBox.Show("Nemoguce obrisati tip koji se nalazi u lokalu!");
                        return;
                    }
                }

                foreach (Tip t in Pod.Tipovi.ToList())
                {
                    if (selektovanTip == t.Oznaka)
                    {
                        Pod.Tipovi.Remove(t);
                        dgTipovi.SelectedIndex = -1;
                        dgTipovi.Items.Refresh();
                    }
                }
            }          

        }

        private void BtnIzbirisiEtiketa_Click(object sender, RoutedEventArgs e)
        {
            string eoznaka = etOznaka.Text;

            foreach (Etiketa et in Pod.Etikete.ToList())
            {
                if (et.Oznaka == eoznaka)
                {
                    foreach(Lokal l in Pod.Lokali.ToList())
                    {
                        foreach (Etiketa  etik in l.Etikete.ToList())
                        {
                            if(etik.Oznaka == eoznaka)
                            {
                                l.Etikete.Remove(etik);                              
                            }
                        }
                    }
                    Pod.Etikete.Remove(et);
                    dgEtikete.SelectedIndex = -1;
                    dgTabela.Items.Refresh();
                }
            }
        }

        public void prikaziLokale()
        {
            dgTabela.Visibility = Visibility.Visible;
            dgTipovi.Visibility = Visibility.Hidden;
            dgEtikete.Visibility = Visibility.Hidden;
            LokalView.Visibility = Visibility.Visible;
            TipView.Visibility = Visibility.Hidden;
            EtiketaView.Visibility = Visibility.Hidden;
            opisL.Visibility = Visibility.Visible;
            opisT.Visibility = Visibility.Hidden;
            opisE.Visibility = Visibility.Hidden;
            GridOpisLokal.Visibility = Visibility.Visible;
            GridOpisTip.Visibility = Visibility.Hidden;
            GridOpisEtiketa.Visibility = Visibility.Hidden;
            filterGrid.Visibility = Visibility.Visible;
        }

        public void prikaziTipove()
        {
            dgTabela.Visibility = Visibility.Hidden;
            dgTipovi.Visibility = Visibility.Visible;
            dgEtikete.Visibility = Visibility.Hidden;
            LokalView.Visibility = Visibility.Hidden;
            TipView.Visibility = Visibility.Visible;
            EtiketaView.Visibility = Visibility.Hidden;
            opisL.Visibility = Visibility.Hidden;
            opisT.Visibility = Visibility.Visible;
            opisE.Visibility = Visibility.Hidden;
            GridOpisLokal.Visibility = Visibility.Hidden;
            GridOpisTip.Visibility = Visibility.Visible;
            GridOpisEtiketa.Visibility = Visibility.Hidden;
            filterGrid.Visibility = Visibility.Hidden;
        }

        public void prikaziEtikete()
        {
            dgTabela.Visibility = Visibility.Hidden;
            dgTipovi.Visibility = Visibility.Hidden;
            dgEtikete.Visibility = Visibility.Visible;
            LokalView.Visibility = Visibility.Hidden;
            TipView.Visibility = Visibility.Hidden;
            EtiketaView.Visibility = Visibility.Visible;
            opisL.Visibility = Visibility.Hidden;
            opisT.Visibility = Visibility.Hidden;
            opisE.Visibility = Visibility.Visible;
            GridOpisLokal.Visibility = Visibility.Hidden;
            GridOpisTip.Visibility = Visibility.Hidden;
            GridOpisEtiketa.Visibility = Visibility.Visible;
            filterGrid.Visibility = Visibility.Hidden;
        }

        private void MitemSacuvaj_Click(object sender, RoutedEventArgs e)
        {
            Save();
        }

        private void MiItemUcitaj_Click(object sender, RoutedEventArgs e)
        {
            Load();
            //Pod.Lokali[0].Tip = Pod.Tipovi[0];
           // MessageBox.Show(Pod.Lokali[0].Tip.Ispis());
        }

        private void Save()
        {
            SaveFileDialog sfd = new SaveFileDialog();
            sfd.Filter = "JSON file (*.json)|*.json";
            sfd.Title = "Sacuvaj kao...";

            if (sfd.ShowDialog() == true)
            {
                using (StreamWriter file = File.CreateText(sfd.FileName))
                {
                    JsonSerializer serializer = new JsonSerializer();

                    serializer.Serialize(file, Pod);
                }
            }
        }

        private void Load()
        {
            OpenFileDialog op = new OpenFileDialog();
            op.Title = "Odaberite fajl";
            op.Filter = "JSON file (*.json)|*.json";

            if(op.ShowDialog() == true)
            {
                StreamReader file = File.OpenText(op.FileName);

                using (file)
                {
                    JsonSerializer serializer = new JsonSerializer();
                    NoviPodaci = (Podaci)serializer.Deserialize(file, typeof(Podaci));
                }
            }

            ubaciPodatke();
            Pretraga = "";
            cbFilter.SelectedIndex = 0;
            dgTabela.ItemsSource = Pod.Lokali;
        }
        
        private void ubaciPodatke()
        {

            int flag_lok = 0;
            int flag_tip = 0;
            int flag_et = 0;
            Lokal ladd = null;
            Tip tipd = null;
            Etiketa etd = null;

            if (noviPodaci != null)
            {

                if (Pod.Tipovi.Count == 0)
                {
                    foreach (Tip t in NoviPodaci.Tipovi)
                    {
                        Pod.Tipovi.Add(t);
                    }
                }
                else
                {
                    foreach (Tip l1 in NoviPodaci.Tipovi)
                    {
                        foreach (Tip l2 in Pod.Tipovi.ToList())
                        {
                            if (l2.Oznaka == l1.Oznaka)
                            {
                                flag_tip = -1;
                                break;
                            }
                            else
                            {
                                tipd = l1;
                                flag_tip = 1;
                            }


                        }

                        if (flag_tip == 1)
                        {
                            Pod.Tipovi.Add(tipd);
                        }

                        flag_tip = 0;
                    }
                }

                if (Pod.Etikete.Count == 0)
                {
                    foreach (Etiketa et in NoviPodaci.Etikete)
                    {
                        Pod.Etikete.Add(et);
                    }
                }
                else
                {
                    foreach (Etiketa l1 in NoviPodaci.Etikete)
                    {
                        foreach (Etiketa l2 in Pod.Etikete.ToList())
                        {
                            if (l2.Oznaka == l1.Oznaka)
                            {
                                flag_et = -1;
                                break;
                            }
                            else
                            {
                                etd = l1;
                                flag_et = 1;
                            }
                        }

                        if (flag_et == 1)
                        {
                            Pod.Etikete.Add(etd);
                        }

                        flag_et = 0;
                    }
                }


                if (Pod.Lokali.Count == 0)
                {
                    foreach (Lokal l in NoviPodaci.Lokali)
                    {
                        foreach (Tip t in Pod.Tipovi)
                        {
                            if (l.Tip.Oznaka == t.Oznaka)
                            {
                                l.Tip = t;
                            }
                        }

                        foreach (Etiketa e in Pod.Etikete)
                        {
                            foreach (Etiketa le in l.Etikete.ToList())
                            {
                                if (e.Oznaka == le.Oznaka)
                                {
                                    l.Etikete.Add(e);
                                }
                            }
                        }
                        Pod.Lokali.Add(l);

                    }
                }
                else
                {
                    foreach (Lokal l1 in NoviPodaci.Lokali)
                    {
                        foreach (Lokal l2 in Pod.Lokali.ToList())
                        {
                            if (l2.Oznaka == l1.Oznaka)
                            {
                                flag_lok = -1;
                                break;
                            }
                            else
                            {
                                ladd = l1;
                                flag_lok = 1;
                            }


                        }

                        if (flag_lok == 1)
                        {

                            foreach (Tip t in Pod.Tipovi)
                            {
                                if (ladd.Tip.Oznaka == t.Oznaka)
                                {
                                    ladd.Tip = t;
                                }
                            }

                            foreach (Etiketa e in Pod.Etikete)
                            {
                                foreach (Etiketa le in ladd.Etikete.ToList())
                                {
                                    if (e.Oznaka == le.Oznaka)
                                    {
                                        ladd.Etikete.Add(e);
                                    }
                                }
                            }

                            Pod.Lokali.Add(ladd);
                        }

                        flag_lok = 0;
                    }
                }
            }
        }

        private void ListView_PreviewMoustLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            startPoint = e.GetPosition(null);
        }

        private void ListView_MouseMove(object sender, MouseEventArgs e)
        {
            Point mousePos = e.GetPosition(null);
            Vector diff = startPoint - mousePos;

            if (e.LeftButton == MouseButtonState.Pressed &&
               (Math.Abs(diff.X) > SystemParameters.MinimumHorizontalDragDistance ||
               Math.Abs(diff.Y) > SystemParameters.MinimumVerticalDragDistance))
            {

                ListBox listBox = sender as ListBox;
                ListBoxItem listBoxItem =
                    FindAncestor<ListBoxItem>((DependencyObject)e.OriginalSource);
                if (listBoxItem != null)
                {

                    Lokal lokal = (Lokal)listBox.ItemContainerGenerator.
                        ItemFromContainer(listBoxItem);

                    DataObject dragData = new DataObject("myFormat", lokal);
                    DragDrop.DoDragDrop(listBoxItem, dragData, DragDropEffects.Move);
                }
            }
        }

        private static T FindAncestor<T>(DependencyObject current) where T : DependencyObject
        {
            do
            {
                if (current is T)
                {
                    return (T)current;
                }
                current = VisualTreeHelper.GetParent(current);
            }
            while (current != null);
            return null;
        }

        private void ListView_DragEnter(object sender, DragEventArgs e)
        {
            if (!e.Data.GetDataPresent("myFormat") || sender == e.Source)
            {
                e.Effects = DragDropEffects.None;
            }
        }

        private void ListView_Drop(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent("myFormat"))
            {
                Lokal lokal = e.Data.GetData("myFormat") as Lokal;

                Point p = e.GetPosition(canvasMap);
                bool zauzeto = false;

                Image img = new Image();
                img.Height = 45;
                img.Width = 45;
                img.Source = lokal.Image;

                foreach (Lokal l in Lokali_mapa) 
                {
                    if(l.X != -1 && l.Y != -1)
                    {
                        if(Math.Abs(l.X - p.X) <= 45 && Math.Abs(l.Y - p.Y) <= 45)
                        {
                            zauzeto = true;
                            break;
                        }
                    }
                }

                if(zauzeto != true)
                {
                    if(p.X + img.Width/2 > canvasMap.Width)
                    {
                        return;
                    }
                    if(p.X - img.Width/2 < 0)
                    {
                        return;
                    }
                    if(p.Y + img.Height/2 > canvasMap.Height)
                    {
                        return;
                    }
                    if(p.Y - img.Height/2 < 0)
                    {
                        return;
                    }

                    img.SetValue(Canvas.LeftProperty, p.X - img.Width / 2);
                    img.SetValue(Canvas.TopProperty, p.Y - img.Height / 2);
                    canvasMap.Children.Add(img);

                    lokal.X = p.X;
                    lokal.Y = p.Y;
                    Lokali_mapa.Add(lokal);

                    WrapPanel wp = new WrapPanel();
                    wp.Orientation = Orientation.Vertical;

                    TextBlock id_lok = new TextBlock();
                    id_lok.IsEnabled = false;
                    id_lok.Text = "Id lokala: " + lokal.Oznaka;
                    wp.Children.Add(id_lok);

                    TextBlock ime_lok = new TextBlock();
                    ime_lok.IsEnabled = false;
                    ime_lok.Text = "Ime lokala: " + lokal.Ime;
                    wp.Children.Add(ime_lok);

                    ToolTip hint = new ToolTip();
                    hint.Content = wp;
                    img.ToolTip = hint;

                    ContextMenu cm = new ContextMenu();
                    img.ContextMenu = cm;
                    MenuItem mi = new MenuItem();
                    mi.Header = "Izbrisi";

                    mi.Icon = new Image
                    {
                        Source = new BitmapImage(new Uri("Img/Delete.png", UriKind.Relative))                
                    };


                    cm.Items.Add(mi);

                    mi.Click += delegate (object s, RoutedEventArgs ev) { mi_Click(s, ev, img, lokal); };
             
                }    

            }
        }

        private void mi_Click(object sender, RoutedEventArgs e, Image img, Lokal lok)
        {
            canvasMap.Children.Remove(img);
            Lokali_mapa.Remove(lok);         
        }

        private void BtnClearMap_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult messageBoxResult = System.Windows.MessageBox.Show("Da li ste sigurni da zelite obrisati sve ikonice sa mape?", "Potvrda brisanja", System.Windows.MessageBoxButton.YesNo);
            if (messageBoxResult == MessageBoxResult.Yes)
            {
                canvasMap.Children.Clear();
                Lokali_mapa.Clear();
            }        
        }

        private void MenuItem_Click(object sender, RoutedEventArgs e)
        {
            lgnForm login = new lgnForm();
            this.Close();
            login.Show();
        }

        private void initCommands()
        {
            cmdDodajLokal.InputGestures.Add(new KeyGesture(Key.L, ModifierKeys.Control));
            CommandBindings.Add(new CommandBinding(cmdDodajLokal, Button_Click));

            cmdDodajTip.InputGestures.Add(new KeyGesture(Key.T, ModifierKeys.Control));
            CommandBindings.Add(new CommandBinding(cmdDodajTip, Button_Click_1));

            cmdDodajEtiketu.InputGestures.Add(new KeyGesture(Key.E, ModifierKeys.Control));
            CommandBindings.Add(new CommandBinding(cmdDodajEtiketu, Button_Click_2));

            cmdOpen.InputGestures.Add(new KeyGesture(Key.U, ModifierKeys.Control | ModifierKeys.Shift));
            CommandBindings.Add(new CommandBinding(cmdOpen, MiItemUcitaj_Click));

            cmdSave.InputGestures.Add(new KeyGesture(Key.S, ModifierKeys.Control | ModifierKeys.Shift));
            CommandBindings.Add(new CommandBinding(cmdSave, MitemSacuvaj_Click));

            cmdOdjava.InputGestures.Add(new KeyGesture(Key.O, ModifierKeys.Control | ModifierKeys.Shift));
            CommandBindings.Add(new CommandBinding(cmdOdjava, MenuItem_Click));

            cmdPrikaziLokale.InputGestures.Add(new KeyGesture(Key.D1, ModifierKeys.Control));
            CommandBindings.Add(new CommandBinding(cmdPrikaziLokale, Lokali_Prikazi_Click));

            cmdPrikazeEtikete.InputGestures.Add(new KeyGesture(Key.D2, ModifierKeys.Control));
            CommandBindings.Add(new CommandBinding(cmdPrikazeEtikete, Etikete_Prikazi_Click));

            cmdPrikazeTipove.InputGestures.Add(new KeyGesture(Key.D3, ModifierKeys.Control));
            CommandBindings.Add(new CommandBinding(cmdPrikazeTipove, Tipovi_Prikazi_Click));

            cmdHelp.InputGestures.Add(new KeyGesture(Key.F1));
            CommandBindings.Add(new CommandBinding(cmdHelp, MenuItem_Click_1));
        }

        public void MenuItem_Click_1(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start(System.IO.Path.GetFullPath(@"..\..\Help.chm"));
        }

        private void CbFilter_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            FilterLokali = new ObservableCollection<Lokal>();
            Pretraga = "";

            if(cbFilter.SelectedIndex == 0)
            {
                dgTabela.ItemsSource = Pod.Lokali;
            }
            else if(cbFilter.SelectedIndex == 1)
            {
                foreach (Lokal l in Pod.Lokali)
                {
                    if(l.Hendikepirane == true)
                    {
                        FilterLokali.Add(l);
                        dgTabela.ItemsSource = FilterLokali;
                    }
                }

                if (FilterLokali.Count == 0)
                {
                    dgTabela.ItemsSource = null;
                }
            }
            else if(cbFilter.SelectedIndex == 2)
            {
                foreach (Lokal l in Pod.Lokali)
                {
                    if (l.DozvoljenoPusenje == true)
                    {
                        FilterLokali.Add(l);
                        dgTabela.ItemsSource = FilterLokali;
                    }
                }

                if (FilterLokali.Count == 0)
                {
                    dgTabela.ItemsSource = null;
                }
            }
            else if(cbFilter.SelectedIndex == 3)
            {
                foreach (Lokal l in Pod.Lokali)
                {
                    if (l.Rezervacije == true)
                    {
                        FilterLokali.Add(l);
                        dgTabela.ItemsSource = FilterLokali;
                    }
                }

                if(FilterLokali.Count == 0)
                {
                    dgTabela.ItemsSource = null;
                }
            }
            else
            {
                dgTabela.ItemsSource = Pod.Lokali;
            }

            dgTabela.SelectedIndex = -1;
        }

        private void BtnSearch_Click(object sender, RoutedEventArgs e)
        {

            LokaliSearch = new ObservableCollection<Lokal>();

            if(cbFilter.SelectedIndex == 0)
            {
                foreach (Lokal l in Pod.Lokali)
                {
                    if (l.Oznaka == Pretraga)
                    {
                        LokaliSearch.Add(l);
                    }
                }

                if (Pretraga == "")
                {
                    dgTabela.ItemsSource = Pod.Lokali;
                    LokaliSearch = new ObservableCollection<Lokal>();
                    return;
                }
                else if (LokaliSearch.Count > 0)
                {
                    dgTabela.ItemsSource = LokaliSearch;
                }
                else
                {
                    MessageBox.Show("Lokal sa oznakom " + Pretraga + " ne postoji!");
                    LokaliSearch = new ObservableCollection<Lokal>();
                    Pretraga = "";
                    return;
                }
            }
            else
            {
                foreach (Lokal l in FilterLokali)
                {
                    if (l.Oznaka == Pretraga)
                    {
                        LokaliSearch.Add(l);
                    }
                }

                if (Pretraga == "")
                {
                    dgTabela.ItemsSource = FilterLokali;
                    LokaliSearch = new ObservableCollection<Lokal>();
                    return;
                }
                else if (LokaliSearch.Count > 0)
                {
                    dgTabela.ItemsSource = LokaliSearch;
                }
                else
                {
                    MessageBox.Show("Lokal sa oznakom " + Pretraga + " ne postoji!");
                    LokaliSearch = new ObservableCollection<Lokal>();
                    Pretraga = "";
                    return;
                }
            }

            dgTabela.SelectedIndex = -1;
                         
        }
    }
}

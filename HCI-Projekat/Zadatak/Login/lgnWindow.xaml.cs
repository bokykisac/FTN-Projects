using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
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

namespace Zadatak.Login
{
    /// <summary>
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class lgnForm : Window, INotifyPropertyChanged
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

        private ObservableCollection<User> users = new ObservableCollection<User>();
        private User currentUser;
        private string username;
        private string email;
        public static RoutedCommand cmdLogin = new RoutedCommand();

        public string Username
        {
            get
            {
                return username;
            }
            set
            {
                if (username != value)
                {
                    username = value;
                    OnPropertyChanged("Username");
                }
            }
        }

        public string Email
        {
            get
            {
                return email;
            }
            set
            {
                if (email != value)
                {
                    email = value;
                    OnPropertyChanged("Email");
                }
            }
        }

        public User CurrentUser
        {
            get { return this.currentUser; }
            set { this.currentUser = value; }
        }

        public ObservableCollection<User> Users
        {
            get { return this.users; }
            set { this.users = value; }
        }


        public lgnForm()
        {
            InitializeComponent();
            this.DataContext = this;

            loadUsers();

            cmdLogin.InputGestures.Add(new KeyGesture(Key.Enter));
            CommandBindings.Add(new CommandBinding(cmdLogin, BtnSign_Click));

        }

        private void BtnSign_Click(object sender, RoutedEventArgs e)
        {
            ObservableCollection<User> decryptedUsers = decrypt(users);

            foreach (User u in decryptedUsers)
            {
                if(u.Username == Username && u.Password == txtPassword.Password)
                {
                    currentUser = u;
                    MainWindow mw = new MainWindow(u);
                    this.Close();
                    mw.Show();
                }
            }
            errLabel.Visibility = Visibility.Visible;
        
        }

        private void BtnRegister_Click(object sender, RoutedEventArgs e)
        {
            regForm w2 = new regForm(this);
            this.Hide();
            w2.Show();
        }

        private void loadUsers()
        {
            if (File.Exists(@"..\..\Users.json"))
            {
                StreamReader file = File.OpenText(@"..\..\Users.json");

                using (file)
                {
                    JsonSerializer serializer = new JsonSerializer();
                    users = (ObservableCollection<User>)serializer.Deserialize(file, typeof(ObservableCollection<User>));
                }
            }
        }

        private ObservableCollection<User> decrypt(ObservableCollection<User> users)
        {
            ObservableCollection<User> oldUsers = new ObservableCollection<User>();

            foreach (User u in users)
            {
                string dPass = "";
                string userPass = u.Password;

                dPass += userPass.Substring(3, userPass.Length - 3);
                dPass += userPass.Substring(0,3);

                User user = new User(u.Username, dPass, u.Email);
                oldUsers.Add(user);
            }

            return oldUsers;

        }

        private void TxtUsername_GotFocus(object sender, RoutedEventArgs e)
        {
            txtUsername.BorderBrush = Brushes.Navy;
            txtUsername.BorderThickness = new Thickness(6, 4, 6, 3);
        }

        private void TxtUsername_LostFocus(object sender, RoutedEventArgs e)
        {
            txtUsername.BorderBrush = null;
        }

        private void TxtPassword_LostFocus(object sender, RoutedEventArgs e)
        {
            txtPassword.BorderBrush = null;
        }

        private void TxtPassword_GotFocus(object sender, RoutedEventArgs e)
        {
            txtPassword.BorderBrush = Brushes.Navy;
            txtPassword.BorderThickness = new Thickness(6, 4, 6, 3);
        }
    }
}

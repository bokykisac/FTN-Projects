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
    /// Interaction logic for Window2.xaml
    /// </summary>
    public partial class regForm : Window, INotifyPropertyChanged
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

        private lgnForm parent;
        private ObservableCollection<User> users;
        private string username;
        private string email;
        public static RoutedCommand cmdReg = new RoutedCommand();

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


        public regForm(lgnForm form)
        {
            parent = form;
            users = parent.Users;

            if (users == null)
            {
                users = new ObservableCollection<User>();
            }

            InitializeComponent();
            this.DataContext = this;

            cmdReg.InputGestures.Add(new KeyGesture(Key.Enter));
            CommandBindings.Add(new CommandBinding(cmdReg, Button_Click));

        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {

            if (provera())
            {
                User newUser = new User(Username, txtPassword.Password, Email);              
                User encryptedUser = encrypt(newUser);

                users.Add(encryptedUser);
                parent.Users = users;


                using (StreamWriter file = File.CreateText(@"..\..\Users.json"))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, users);
                }

                this.Close();
                parent.Show();
            }

        }

        private bool provera()
        {

            if(users != null)
            {
                foreach (User u in users)
                {
                    if (u.Username == Username)
                    {
                        MessageBox.Show("Korisnicko ime " + Username + " vec postoji!");
                        txtUsername.Focus();
                        return false;
                    }
                }

            }

            if(txtPassword.Password.Length < 5)
            {
                MessageBox.Show("Lozinka se mora sastojati od najmanje 5 karaktera!");
                txtPassword.Focus();
                return false;
            }
            
            if (String.IsNullOrEmpty(txtUsername.Text))
            {
                MessageBox.Show("Sva polja moraju biti popunjena!");
                return false;
            }

            if (String.IsNullOrEmpty(txtPassword.Password))
            {
                MessageBox.Show("Sva polja moraju biti popunjena!");
                return false;
            }

            if (String.IsNullOrEmpty(txtEmail.Text))
            {
                MessageBox.Show("Sva polja moraju biti popunjena!");
                return false;
            }

            return true;
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            lgnForm w1 = new lgnForm();
            this.Close();
            w1.Show();
        }

        private User encrypt(User u)
        {
            string userPass = u.Password;
            string ePass = "";

            ePass += userPass.Substring(userPass.Length - 3);
            ePass += userPass.Substring(0, userPass.Length - 3);

            User newUser = new User(u.Username, ePass, u.Email);

            return newUser;
        }

        private void TxtUsername_GotFocus(object sender, RoutedEventArgs e)
        {
            txtUsername.BorderBrush = Brushes.Navy;
            txtUsername.BorderThickness = new Thickness(1,1,1,1);
        }

        private void TxtPassword_GotFocus(object sender, RoutedEventArgs e)
        {
            txtPassword.BorderBrush = Brushes.Navy;
            txtPassword.BorderThickness = new Thickness(1,1,1,1);
        }

        private void TxtEmail_GotFocus(object sender, RoutedEventArgs e)
        {
            txtEmail.BorderBrush = Brushes.Navy;
            txtEmail.BorderThickness = new Thickness(1,1,1,1);
        }

        private void TxtEmail_LostFocus(object sender, RoutedEventArgs e)
        {
            txtEmail.BorderBrush = null;
        }

        private void TxtPassword_LostFocus(object sender, RoutedEventArgs e)
        {
            txtPassword.BorderBrush = null;
        }

        private void TxtUsername_LostFocus(object sender, RoutedEventArgs e)
        {
            txtUsername.BorderBrush = null;
        }
    }
}
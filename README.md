# 🏦 Hisaab - Personal Finance Tracker

A comprehensive web-based personal finance tracker with Khatabook-style contact management that helps you manage your credits, expenses, and udhaar (loans/debts) with ease. Features a modern, animated UI with dark mode support. All data is stored locally in your browser for complete privacy.

## ✨ Features

### 📊 Dashboard
- **Real-time Summary**: View total credits, expenses, and current balance
- **Visual Cards**: Color-coded summary cards for quick overview
- **Balance Tracking**: Automatically calculates and displays your current financial position

### 💰 Credits Management
- Add credits with date, amount, and source
- View all credits in a sortable table
- **Edit existing credit entries**
- Delete individual credit entries
- Automatic date defaulting to today

### 💳 Expenses Management
- Record expenses with date, purpose, and amount
- Organized expense tracking table
- **Edit existing expense entries**
- Individual expense deletion
- Purpose-based categorization

### 📋 Udhaar (Loans/Debts) Management
- **Khatabook-Style Interface**: Professional contact management system
- **Contact Management**: Add contacts with name and phone number
- **Individual Contact Cards**: Visual cards with avatars and balance indicators
- **Quick Actions**: Fast transaction buttons for each contact
- **Individual-Level Tracking**: Monitor each person's transactions separately
- **Partial Payment Support**: Track when money is given, taken, and returned
- **Edit Transaction Entries**: Correct mistakes in any udhaar transaction
- **Four Transaction Types**:
  - Money Lent (Given to others)
  - Money Borrowed (Taken from others)  
  - Received Back (When someone returns your money)
  - Paid Back (When you return someone's money)
- **Person-wise Summary**: See who owes what at a glance
- **Running Balance**: Track balance changes with each transaction
- **Smart Filtering**: Filter by person or transaction type
- **Complete Transaction History**: See all udhaar transactions chronologically
- **Net Calculations**: Automatic calculation of outstanding amounts
- **Contact Editing**: Edit contact information and manage relationships
- **Visual Balance Indicators**: Color-coded balance states (owes you/you owe/settled)

### 🔧 Data Management
- **Local Storage**: All data stored securely in your browser
- **Export/Import**: Backup and restore your data as JSON files
- **Data Persistence**: Your data persists between browser sessions
- **Clear Data**: Option to reset all data

### 🎨 User Experience
- **Modern Animated UI**: Clean, intuitive interface with smooth animations and transitions
- **Dark Mode Support**: Toggle between light and dark themes with persistent settings
- **Theme Toggle**: Convenient moon/sun icon for instant theme switching
- **Glass Morphism Effects**: Modern backdrop blur and transparency effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **CSS Variables**: Dynamic theming system for consistent color schemes
- **Micro-interactions**: Hover effects, button animations, and visual feedback
- **Khatabook-Style Cards**: Professional contact cards with avatars and quick actions
- **Modal System**: Polished popup forms for adding and editing entries
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + S`: Export data
  - `Ctrl/Cmd + N`: Focus on credit amount input
  - `Ctrl/Cmd + E`: Focus on expense amount input
- **Notifications**: Success/error messages for user actions
- **Currency Formatting**: Indian Rupee formatting with proper locale
- **Individual Transaction Tracking**: Each udhaar transaction tracked separately
- **Partial Payment Support**: Handle partial repayments easily
- **Edit Functionality**: Correct mistakes in any entry with ease
- **Color-coded Balances**: Visual indicators for who owes what
- **Smart Filtering**: Filter transactions by person or type
- **Touch Optimizations**: Enhanced mobile touch interactions
- **Accessibility**: Reduced motion support and proper ARIA labels

## 🚀 Getting Started

### Option 1: Simple File Opening
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start tracking your finances!

### Option 2: Local Server (Recommended)
1. Navigate to the project folder in terminal
2. Run a simple HTTP server:

   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Using Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (if you have it installed):**
   ```bash
   npx http-server
   ```

3. Open your browser and go to `http://localhost:8000`

## 📁 Project Structure

```
Hisaab/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 💾 Data Storage

- **Location**: Browser's localStorage
- **Format**: JSON
- **Persistence**: Data persists until manually cleared or browser data is cleared
- **Privacy**: All data stays on your device - no external servers involved

## 🔒 Privacy & Security

- **100% Local**: No data is sent to external servers
- **No Registration**: No accounts or personal information required
- **Offline Capable**: Works completely offline after initial load
- **Your Data, Your Control**: Export, import, or delete data anytime

## 🎯 Usage Tips

1. **Regular Backups**: Use the export feature to backup your data regularly
2. **Date Management**: Dates default to today but can be changed for past entries
3. **Amount Precision**: Supports decimal amounts for precise tracking
4. **Mobile Friendly**: Add to your phone's home screen for quick access
5. **Contact Management**: Add contacts first, then use their cards for quick transactions
6. **Dark Mode**: Toggle between themes using the moon/sun icon in the header
7. **Quick Actions**: Use contact card buttons for faster transaction entry
8. **Balance Tracking**: Visual indicators show who owes what at a glance
9. **Theme Persistence**: Your theme preference is automatically saved
10. **Touch Gestures**: Optimized for mobile touch interactions

## 🛠️ Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with custom properties, CSS Grid, Flexbox
- **Animations**: CSS keyframes, transitions, and transform animations
- **Theme System**: Dynamic CSS variables with data attribute switching
- **Storage**: Browser localStorage API with JSON serialization
- **Architecture**: Modular JavaScript with event-driven design
- **Performance**: Optimized animations using transform and opacity
- **Compatibility**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**: None - completely self-contained
- **Contact System**: Full CRUD operations for contact management
- **Dark Mode**: System preference detection with manual toggle override

## 🤝 Contributing

This is a simple, self-contained project perfect for:
- Learning web development
- Personal finance tracking
- Customization for specific needs

Feel free to modify the code to suit your requirements!

## 📝 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 🆘 Troubleshooting

### Data Not Saving?
- Ensure your browser allows localStorage
- Check if you're in private/incognito mode
- Try refreshing the page

### Import Not Working?
- Ensure the JSON file was exported from this app
- Check file format is valid JSON
- Try exporting first, then importing to test

### Dark Mode Not Working?
- Clear browser cache and reload
- Check if browser supports CSS custom properties
- Ensure JavaScript is enabled

### Contact Cards Not Displaying?
- Verify contacts are added properly
- Check browser console for JavaScript errors
- Try adding a new contact to test functionality

### Browser Compatibility Issues?
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript
- Clear browser cache if issues persist
- Ensure CSS Grid and Flexbox support

### Theme Toggle Not Responding?
- Check JavaScript console for errors
- Verify localStorage permissions
- Try manually switching with browser dev tools

---

**Happy Finance Tracking! 📈💰**

*Built with ❤️ for seamless financial management*

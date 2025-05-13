// Common passwords list (top 100 most common passwords)
const commonPasswords = [
    "123456",
    "password",
    "123456789",
    "12345678",
    "12345",
    "qwerty",
    "1234567",
    "111111",
    "1234567890",
    "123123",
    "abc123",
    "1234",
    "password1",
    "iloveyou",
    "1q2w3e4r",
    "000000",
    "qwerty123",
    "zaq12wsx",
    "dragon",
    "sunshine",
    "princess",
    "letmein",
    "654321",
    "monkey",
    "27653",
    "1qaz2wsx",
    "123321",
    "qwertyuiop",
    "superman",
    "asdfghjkl",
    "trustno1",
    "welcome",
    "admin",
    "charlie",
    "football",
    "master",
    "michael",
    "shadow",
    "ashley",
    "bailey",
    "baseball",
    "passw0rd",
    "jesus",
    "lovely",
    "hello",
    "freedom",
    "whatever",
    "qazwsx",
    "666666",
    "!@#$%^&*",
    "888888",
    "7777777",
    "1q2w3e4r5t",
    "qwe123",
    "555555",
    "thomas",
    "matthew",
    "donald",
    "batman",
    "121212",
    "flower",
    "hottie",
    "loveme",
    "zxcvbnm",
    "pokemon",
    "daniel",
    "asdasd",
    "jessica",
    "starwars",
    "klaster",
    "jordan23",
    "222222",
    "george",
    "access",
    "andrea",
    "joshua",
    "asdf1234",
    "buster",
    "soccer",
    "hockey",
    "killer",
    "andrew",
    "harley",
    "chelsea",
    "ranger",
    "jasper",
    "robert",
    "12341234",
    "q1w2e3r4",
    "mustang",
    "justin",
    "william",
    "liverpool",
    "london",
    "jennifer",
    "hannah",
    "anthony"
];

// Common patterns to check
const commonPatterns = [
    /^12345\d*$/,                  // Sequential numbers starting with 12345
    /^98765\d*$/,                  // Sequential numbers starting with 98765
    /^0{4,}$/,                     // Repeated zeros
    /^1{4,}$/,                     // Repeated ones
    /^(.)\\1{3,}$/,                // Any character repeated 4+ times
    /qwerty/i,                     // Contains "qwerty"
    /asdf/i,                       // Contains "asdf"
    /zxcv/i,                       // Contains "zxcv"
    /1q2w3e/i,                     // Keyboard pattern 1q2w3e
    /qazwsx/i,                     // Keyboard pattern qazwsx
    /password/i,                   // Contains "password"
    /^[a-z]+$/i,                   // Only letters
    /^\\d+$/,                      // Only numbers
    /^(19|20)\\d{2}$/,             // Years (1900-2099)
    /^0[1-9]|1[0-2]([0-3]\\d)$/    // Date format MMDD
];

// Common personal information patterns
const personalInfoPatterns = [
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,  // Month names
    /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,  // Full month names
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,  // Day names
    /^(spring|summer|fall|winter)/i,  // Season names
    /admin/i,                      // Admin
    /root/i,                       // Root
    /user/i,                       // User
    /login/i,                      // Login
    /welcome/i,                    // Welcome
    /letmein/i,                    // Let me in
    /football/i,                   // Football
    /baseball/i,                   // Baseball
    /hockey/i,                     // Hockey
    /soccer/i,                     // Soccer
    /basketball/i,                 // Basketball
    /dragon/i,                     // Dragon
    /monkey/i,                     // Monkey
    /qwerty/i,                     // Qwerty
    /abc123/i,                     // Abc123
    /trustno1/i,                   // Trust no one
    /princess/i,                   // Princess
    /sunshine/i,                   // Sunshine
    /iloveyou/i,                   // I love you
    /superman/i,                   // Superman
    /batman/i                      // Batman
];

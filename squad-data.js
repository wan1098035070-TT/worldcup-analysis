globalThis.SquadData = (() => {
  const roleShape = [
    ["GK", 1],
    ["DEF", 4],
    ["MID", 3],
    ["FWD", 3]
  ];

  const squads = {
    "法国": [
      ["Mike Maignan", "Mike_Maignan", 16, "GK", "AC Milan"],
      ["Jules Kounde", "Jules_Koundé", 5, "DEF", "Barcelona"],
      ["William Saliba", "William_Saliba", 17, "DEF", "Arsenal"],
      ["Dayot Upamecano", "Dayot_Upamecano", 4, "DEF", "Bayern Munich"],
      ["Theo Hernandez", "Theo_Hernandez", 22, "DEF", "AC Milan"],
      ["Aurelien Tchouameni", "Aurélien_Tchouaméni", 8, "MID", "Real Madrid"],
      ["Eduardo Camavinga", "Eduardo_Camavinga", 6, "MID", "Real Madrid"],
      ["Antoine Griezmann", "Antoine_Griezmann", 7, "MID", "Atletico Madrid"],
      ["Ousmane Dembele", "Ousmane_Dembélé", 11, "FWD", "Paris Saint-Germain"],
      ["Kylian Mbappe", "Kylian_Mbappé", 10, "FWD", "Real Madrid"],
      ["Marcus Thuram", "Marcus_Thuram", 15, "FWD", "Inter Milan"]
    ],
    "西班牙": [
      ["Unai Simon", "Unai_Simón", 23, "GK", "Athletic Club"],
      ["Dani Carvajal", "Dani_Carvajal", 2, "DEF", "Real Madrid"],
      ["Robin Le Normand", "Robin_Le_Normand", 3, "DEF", "Atletico Madrid"],
      ["Aymeric Laporte", "Aymeric_Laporte", 14, "DEF", "Al Nassr"],
      ["Marc Cucurella", "Marc_Cucurella", 24, "DEF", "Chelsea"],
      ["Rodri", "Rodri_(footballer,_born_1996)", 16, "MID", "Manchester City"],
      ["Pedri", "Pedri", 20, "MID", "Barcelona"],
      ["Fabian Ruiz", "Fabián_Ruiz", 8, "MID", "Paris Saint-Germain"],
      ["Lamine Yamal", "Lamine_Yamal", 19, "FWD", "Barcelona"],
      ["Nico Williams", "Nico_Williams", 17, "FWD", "Athletic Club"],
      ["Alvaro Morata", "Álvaro_Morata", 7, "FWD", "AC Milan"]
    ],
    "阿根廷": [
      ["Emiliano Martinez", "Emiliano_Martínez", 23, "GK", "Aston Villa"],
      ["Nahuel Molina", "Nahuel_Molina", 26, "DEF", "Atletico Madrid"],
      ["Cristian Romero", "Cristian_Romero", 13, "DEF", "Tottenham Hotspur"],
      ["Nicolas Otamendi", "Nicolás_Otamendi", 19, "DEF", "Benfica"],
      ["Nicolas Tagliafico", "Nicolás_Tagliafico", 3, "DEF", "Lyon"],
      ["Rodrigo De Paul", "Rodrigo_De_Paul", 7, "MID", "Atletico Madrid"],
      ["Alexis Mac Allister", "Alexis_Mac_Allister", 20, "MID", "Liverpool"],
      ["Enzo Fernandez", "Enzo_Fernández", 24, "MID", "Chelsea"],
      ["Lionel Messi", "Lionel_Messi", 10, "FWD", "Inter Miami"],
      ["Julian Alvarez", "Julián_Álvarez", 9, "FWD", "Atletico Madrid"],
      ["Lautaro Martinez", "Lautaro_Martínez", 22, "FWD", "Inter Milan"]
    ],
    "英格兰": [
      ["Jordan Pickford", "Jordan_Pickford", 1, "GK", "Everton"],
      ["Kyle Walker", "Kyle_Walker", 2, "DEF", "Manchester City"],
      ["John Stones", "John_Stones", 5, "DEF", "Manchester City"],
      ["Marc Guehi", "Marc_Guéhi", 6, "DEF", "Crystal Palace"],
      ["Luke Shaw", "Luke_Shaw", 3, "DEF", "Manchester United"],
      ["Declan Rice", "Declan_Rice", 4, "MID", "Arsenal"],
      ["Jude Bellingham", "Jude_Bellingham", 10, "MID", "Real Madrid"],
      ["Phil Foden", "Phil_Foden", 11, "MID", "Manchester City"],
      ["Bukayo Saka", "Bukayo_Saka", 7, "FWD", "Arsenal"],
      ["Harry Kane", "Harry_Kane", 9, "FWD", "Bayern Munich"],
      ["Marcus Rashford", "Marcus_Rashford", 19, "FWD", "Manchester United"]
    ],
    "葡萄牙": [
      ["Diogo Costa", "Diogo_Costa", 22, "GK", "Porto"],
      ["Joao Cancelo", "João_Cancelo", 20, "DEF", "Al Hilal"],
      ["Ruben Dias", "Rúben_Dias", 4, "DEF", "Manchester City"],
      ["Goncalo Inacio", "Gonçalo_Inácio", 14, "DEF", "Sporting CP"],
      ["Nuno Mendes", "Nuno_Mendes", 19, "DEF", "Paris Saint-Germain"],
      ["Joao Palhinha", "João_Palhinha", 6, "MID", "Bayern Munich"],
      ["Vitinha", "Vitinha_(footballer,_born_February_2000)", 23, "MID", "Paris Saint-Germain"],
      ["Bruno Fernandes", "Bruno_Fernandes", 8, "MID", "Manchester United"],
      ["Bernardo Silva", "Bernardo_Silva", 10, "FWD", "Manchester City"],
      ["Rafael Leao", "Rafael_Leão", 17, "FWD", "AC Milan"],
      ["Cristiano Ronaldo", "Cristiano_Ronaldo", 7, "FWD", "Al Nassr"]
    ],
    "巴西": [
      ["Alisson Becker", "Alisson_Becker", 1, "GK", "Liverpool"],
      ["Danilo", "Danilo_(footballer,_born_July_1991)", 2, "DEF", "Flamengo"],
      ["Marquinhos", "Marquinhos", 4, "DEF", "Paris Saint-Germain"],
      ["Gabriel Magalhaes", "Gabriel_Magalhães", 14, "DEF", "Arsenal"],
      ["Wendell", "Wendell_(footballer)", 6, "DEF", "Porto"],
      ["Casemiro", "Casemiro", 5, "MID", "Manchester United"],
      ["Bruno Guimaraes", "Bruno_Guimarães", 8, "MID", "Newcastle United"],
      ["Lucas Paqueta", "Lucas_Paquetá", 18, "MID", "West Ham United"],
      ["Raphinha", "Raphinha", 11, "FWD", "Barcelona"],
      ["Vinicius Junior", "Vinícius_Júnior", 7, "FWD", "Real Madrid"],
      ["Rodrygo", "Rodrygo", 10, "FWD", "Real Madrid"]
    ],
    "荷兰": [
      ["Bart Verbruggen", "Bart_Verbruggen", 1, "GK", "Brighton"],
      ["Denzel Dumfries", "Denzel_Dumfries", 22, "DEF", "Inter Milan"],
      ["Virgil van Dijk", "Virgil_van_Dijk", 4, "DEF", "Liverpool"],
      ["Micky van de Ven", "Micky_van_de_Ven", 15, "DEF", "Tottenham Hotspur"],
      ["Nathan Ake", "Nathan_Aké", 5, "DEF", "Manchester City"],
      ["Frenkie de Jong", "Frenkie_de_Jong", 21, "MID", "Barcelona"],
      ["Xavi Simons", "Xavi_Simons", 7, "MID", "RB Leipzig"],
      ["Tijjani Reijnders", "Tijjani_Reijnders", 14, "MID", "AC Milan"],
      ["Cody Gakpo", "Cody_Gakpo", 11, "FWD", "Liverpool"],
      ["Memphis Depay", "Memphis_Depay", 10, "FWD", "Corinthians"],
      ["Donyell Malen", "Donyell_Malen", 18, "FWD", "Aston Villa"]
    ],
    "摩洛哥": [
      ["Yassine Bounou", "Yassine_Bounou", 1, "GK", "Al Hilal"],
      ["Achraf Hakimi", "Achraf_Hakimi", 2, "DEF", "Paris Saint-Germain"],
      ["Nayef Aguerd", "Nayef_Aguerd", 5, "DEF", "Real Sociedad"],
      ["Romain Saiss", "Romain_Saïss", 6, "DEF", "Al Sadd"],
      ["Noussair Mazraoui", "Noussair_Mazraoui", 3, "DEF", "Manchester United"],
      ["Sofyan Amrabat", "Sofyan_Amrabat", 4, "MID", "Fenerbahce"],
      ["Azzedine Ounahi", "Azzedine_Ounahi", 8, "MID", "Panathinaikos"],
      ["Bilal El Khannouss", "Bilal_El_Khannouss", 10, "MID", "Leicester City"],
      ["Hakim Ziyech", "Hakim_Ziyech", 7, "FWD", "Al Duhail"],
      ["Youssef En-Nesyri", "Youssef_En-Nesyri", 19, "FWD", "Fenerbahce"],
      ["Ayoub El Kaabi", "Ayoub_El_Kaabi", 20, "FWD", "Olympiacos"]
    ],
    "德国": [
      ["Manuel Neuer", "Manuel_Neuer", 1, "GK", "Bayern Munich"],
      ["Joshua Kimmich", "Joshua_Kimmich", 6, "DEF", "Bayern Munich"],
      ["Antonio Rudiger", "Antonio_Rüdiger", 2, "DEF", "Real Madrid"],
      ["Jonathan Tah", "Jonathan_Tah", 4, "DEF", "Bayer Leverkusen"],
      ["David Raum", "David_Raum", 3, "DEF", "RB Leipzig"],
      ["Robert Andrich", "Robert_Andrich", 23, "MID", "Bayer Leverkusen"],
      ["Ilkay Gundogan", "İlkay_Gündoğan", 21, "MID", "Manchester City"],
      ["Florian Wirtz", "Florian_Wirtz", 17, "MID", "Bayer Leverkusen"],
      ["Jamal Musiala", "Jamal_Musiala", 10, "FWD", "Bayern Munich"],
      ["Kai Havertz", "Kai_Havertz", 7, "FWD", "Arsenal"],
      ["Leroy Sane", "Leroy_Sané", 19, "FWD", "Bayern Munich"]
    ],
    "日本": [
      ["Zion Suzuki", "Zion_Suzuki", 23, "GK", "Parma"],
      ["Yukinari Sugawara", "Yukinari_Sugawara", 2, "DEF", "Southampton"],
      ["Ko Itakura", "Ko_Itakura", 4, "DEF", "Borussia Monchengladbach"],
      ["Takehiro Tomiyasu", "Takehiro_Tomiyasu", 16, "DEF", "Arsenal"],
      ["Hiroki Ito", "Hiroki_Ito", 21, "DEF", "Bayern Munich"],
      ["Wataru Endo", "Wataru_Endo", 6, "MID", "Liverpool"],
      ["Hidemasa Morita", "Hidemasa_Morita", 5, "MID", "Sporting CP"],
      ["Daichi Kamada", "Daichi_Kamada", 15, "MID", "Crystal Palace"],
      ["Takefusa Kubo", "Takefusa_Kubo", 20, "FWD", "Real Sociedad"],
      ["Kaoru Mitoma", "Kaoru_Mitoma", 7, "FWD", "Brighton"],
      ["Ritsu Doan", "Ritsu_Dōan", 10, "FWD", "Freiburg"]
    ],
    "美国": [
      ["Matt Turner", "Matt_Turner", 1, "GK", "Nottingham Forest"],
      ["Sergino Dest", "Sergiño_Dest", 2, "DEF", "PSV"],
      ["Tim Ream", "Tim_Ream", 13, "DEF", "Charlotte FC"],
      ["Chris Richards", "Chris_Richards_(soccer)", 3, "DEF", "Crystal Palace"],
      ["Antonee Robinson", "Antonee_Robinson", 5, "DEF", "Fulham"],
      ["Tyler Adams", "Tyler_Adams", 4, "MID", "Bournemouth"],
      ["Weston McKennie", "Weston_McKennie", 8, "MID", "Juventus"],
      ["Yunus Musah", "Yunus_Musah", 6, "MID", "AC Milan"],
      ["Christian Pulisic", "Christian_Pulisic", 10, "FWD", "AC Milan"],
      ["Timothy Weah", "Timothy_Weah", 21, "FWD", "Juventus"],
      ["Folarin Balogun", "Folarin_Balogun", 20, "FWD", "Monaco"]
    ],
    "墨西哥": [
      ["Luis Malagon", "Luis_Malagón", 1, "GK", "Club America"],
      ["Jorge Sanchez", "Jorge_Sánchez", 2, "DEF", "Cruz Azul"],
      ["Cesar Montes", "César_Montes", 3, "DEF", "Lokomotiv Moscow"],
      ["Johan Vasquez", "Johan_Vásquez", 5, "DEF", "Genoa"],
      ["Jesus Gallardo", "Jesús_Gallardo", 23, "DEF", "Toluca"],
      ["Edson Alvarez", "Edson_Álvarez", 4, "MID", "West Ham United"],
      ["Luis Chavez", "Luis_Chávez", 24, "MID", "Dynamo Moscow"],
      ["Erick Sanchez", "Érick_Sánchez", 14, "MID", "Club America"],
      ["Hirving Lozano", "Hirving_Lozano", 22, "FWD", "San Diego FC"],
      ["Santiago Gimenez", "Santiago_Giménez", 11, "FWD", "AC Milan"],
      ["Julian Quinones", "Julián_Quiñones", 9, "FWD", "Al Qadsiah"]
    ]
  };

  const compactSquads = {
    "比利时": "Koen Casteels|GK,Thomas Meunier|DEF,Wout Faes|DEF,Jan Vertonghen|DEF,Arthur Theate|DEF,Amadou Onana|MID,Youri Tielemans|MID,Kevin De Bruyne|MID,Jérémy Doku|FWD,Romelu Lukaku|FWD,Leandro Trossard|FWD",
    "克罗地亚": "Dominik Livakovic|GK,Josip Stanisic|DEF,Josko Gvardiol|DEF,Martin Erlic|DEF,Borna Sosa|DEF,Marcelo Brozovic|MID,Matteo Kovacic|MID,Luka Modric|MID,Andrej Kramaric|FWD,Ivan Perisic|FWD,Bruno Petkovic|FWD",
    "哥伦比亚": "Camilo Vargas|GK,Daniel Munoz|DEF,Davinson Sanchez|DEF,Jhon Lucumi|DEF,Johan Mojica|DEF,Jefferson Lerma|MID,Richard Rios|MID,James Rodriguez|MID,Luis Diaz|FWD,Jhon Arias|FWD,Rafael Santos Borre|FWD",
    "塞内加尔": "Edouard Mendy|GK,Kalidou Koulibaly|DEF,Abdou Diallo|DEF,Ismail Jakobs|DEF,Youssouf Sabaly|DEF,Idrissa Gueye|MID,Pape Matar Sarr|MID,Nampalys Mendy|MID,Ismaila Sarr|FWD,Nicolas Jackson|FWD,Sadio Mane|FWD",
    "乌拉圭": "Sergio Rochet|GK,Nahitan Nandez|DEF,Ronald Araujo|DEF,Jose Maria Gimenez|DEF,Mathias Olivera|DEF,Federico Valverde|MID,Manuel Ugarte|MID,Rodrigo Bentancur|MID,Facundo Pellistri|FWD,Darwin Nunez|FWD,Maximiliano Araujo|FWD",
    "瑞士": "Yann Sommer|GK,Silvan Widmer|DEF,Manuel Akanji|DEF,Nico Elvedi|DEF,Ricardo Rodriguez|DEF,Granit Xhaka|MID,Remo Freuler|MID,Denis Zakaria|MID,Xherdan Shaqiri|FWD,Breel Embolo|FWD,Dan Ndoye|FWD",
    "伊朗": "Alireza Beiranvand|GK,Ramin Rezaeian|DEF,Morteza Pouraliganji|DEF,Shoja Khalilzadeh|DEF,Ehsan Hajsafi|DEF,Saeid Ezatolahi|MID,Saman Ghoddos|MID,Mehdi Torabi|MID,Alireza Jahanbakhsh|FWD,Mehdi Taremi|FWD,Sardar Azmoun|FWD",
    "奥地利": "Patrick Pentz|GK,Stefan Posch|DEF,Kevin Danso|DEF,Philipp Lienhart|DEF,Maximilian Wober|DEF,Konrad Laimer|MID,Nicolas Seiwald|MID,Marcel Sabitzer|MID,Christoph Baumgartner|FWD,Marko Arnautovic|FWD,Michael Gregoritsch|FWD",
    "韩国": "Jo Hyeon-woo|GK,Kim Moon-hwan|DEF,Kim Min-jae|DEF,Kim Young-gwon|DEF,Kim Jin-su|DEF,Hwang In-beom|MID,Lee Kang-in|MID,Park Yong-woo|MID,Son Heung-min|FWD,Hwang Hee-chan|FWD,Cho Gue-sung|FWD",
    "厄瓜多尔": "Hernan Galindez|GK,Angelo Preciado|DEF,Felix Torres|DEF,Willian Pacho|DEF,Pervis Estupinan|DEF,Moisés Caicedo|MID,Alan Franco|MID,Kendry Paez|MID,Jeremy Sarmiento|FWD,Enner Valencia|FWD,Gonzalo Plata|FWD",
    "澳大利亚": "Mathew Ryan|GK,Nathaniel Atkinson|DEF,Harry Souttar|DEF,Kye Rowles|DEF,Aziz Behich|DEF,Jackson Irvine|MID,Keanu Baccus|MID,Riley McGree|MID,Martin Boyle|FWD,Mitchell Duke|FWD,Craig Goodwin|FWD",
    "土耳其": "Ugurcan Cakir|GK,Zeki Celik|DEF,Merih Demiral|DEF,Abdulkerim Bardakci|DEF,Ferdi Kadioglu|DEF,Hakan Calhanoglu|MID,Orkun Kokcu|MID,Ismail Yuksek|MID,Arda Guler|FWD,Kenan Yildiz|FWD,Kerem Akturkoglu|FWD",
    "苏格兰": "Angus Gunn|GK,Aaron Hickey|DEF,Kieran Tierney|DEF,Scott McKenna|DEF,Andy Robertson|DEF,Scott McTominay|MID,Billy Gilmour|MID,John McGinn|MID,Ryan Christie|FWD,Che Adams|FWD,Lyndon Dykes|FWD",
    "瑞典": "Robin Olsen|GK,Emil Krafth|DEF,Victor Lindelof|DEF,Isak Hien|DEF,Ludwig Augustinsson|DEF,Kristoffer Olsson|MID,Jens Cajuste|MID,Emil Forsberg|MID,Dejan Kulusevski|FWD,Alexander Isak|FWD,Viktor Gyokeres|FWD",
    "埃及": "Mohamed El Shenawy|GK,Mohamed Hany|DEF,Ahmed Hegazi|DEF,Mohamed Abdelmonem|DEF,Ahmed Fatouh|DEF,Mohamed Elneny|MID,Hamdi Fathi|MID,Trezeguet|MID,Mohamed Salah|FWD,Mostafa Mohamed|FWD,Omar Marmoush|FWD",
    "挪威": "Orjan Nyland|GK,Julian Ryerson|DEF,Leo Ostigard|DEF,Kristoffer Ajer|DEF,Fredrik Bjorkan|DEF,Sander Berge|MID,Martin Odegaard|MID,Patrick Berg|MID,Antonio Nusa|FWD,Erling Haaland|FWD,Alexander Sorloth|FWD",
    "阿尔及利亚": "Anthony Mandrea|GK,Youcef Atal|DEF,Aissa Mandi|DEF,Ramy Bensebaini|DEF,Rayan Ait-Nouri|DEF,Ismael Bennacer|MID,Nabil Bentaleb|MID,Houssem Aouar|MID,Riyad Mahrez|FWD,Amine Gouiri|FWD,Baghdad Bounedjah|FWD",
    "捷克": "Jindrich Stanek|GK,Vladimir Coufal|DEF,Tomas Holes|DEF,Ladislav Krejci|DEF,David Jurasek|DEF,Tomas Soucek|MID,Antonin Barak|MID,Alex Kral|MID,Adam Hlozek|FWD,Patrik Schick|FWD,Mojmir Chytil|FWD",
    "卡塔尔": "Meshaal Barsham|GK,Pedro Miguel|DEF,Boualem Khoukhi|DEF,Tarek Salman|DEF,Abdelkarim Hassan|DEF,Assim Madibo|MID,Abdulaziz Hatem|MID,Akram Afif|MID,Hassan Al-Haydos|FWD,Almoez Ali|FWD,Yusuf Abdurisag|FWD",
    "科特迪瓦": "Yahia Fofana|GK,Wilfried Singo|DEF,Odilon Kossounou|DEF,Evan Ndicka|DEF,Ghislain Konan|DEF,Ibrahim Sangare|MID,Franck Kessie|MID,Seko Fofana|MID,Nicolas Pepe|FWD,Sebastien Haller|FWD,Simon Adingra|FWD",
    "突尼斯": "Bechir Ben Said|GK,Wajdi Kechrida|DEF,Montassar Talbi|DEF,Yassine Meriah|DEF,Ali Abdi|DEF,Ellyes Skhiri|MID,Aissa Laidouni|MID,Hannibal Mejbri|MID,Elias Achouri|FWD,Youssef Msakni|FWD,Seifeddine Jaziri|FWD",
    "加拿大": "Maxime Crepeau|GK,Alistair Johnston|DEF,Moise Bombito|DEF,Derek Cornelius|DEF,Alphonso Davies|DEF,Stephen Eustaquio|MID,Ismael Kone|MID,Jonathan Osorio|MID,Tajon Buchanan|FWD,Jonathan David|FWD,Cyle Larin|FWD",
    "巴拉圭": "Gatito Fernandez|GK,Robert Rojas|DEF,Gustavo Gomez|DEF,Fabian Balbuena|DEF,Junior Alonso|DEF,Mathias Villasanti|MID,Andres Cubas|MID,Matias Rojas|MID,Miguel Almiron|FWD,Julio Enciso|FWD,Antonio Sanabria|FWD",
    "沙特阿拉伯": "Mohammed Al-Owais|GK,Saud Abdulhamid|DEF,Ali Al-Bulaihi|DEF,Hassan Tambakti|DEF,Yasir Al-Shahrani|DEF,Abdulellah Al-Malki|MID,Mohamed Kanno|MID,Salem Al-Dawsari|MID,Firas Al-Buraikan|FWD,Saleh Al-Shehri|FWD,Abdulrahman Ghareeb|FWD",
    "伊拉克": "Jalal Hassan|GK,Hussein Ali|DEF,Saad Natiq|DEF,Rebin Sulaka|DEF,Merchas Doski|DEF,Amir Al-Ammari|MID,Ibrahim Bayesh|MID,Osama Rashid|MID,Ali Jasim|FWD,Aymen Hussein|FWD,Mohanad Ali|FWD",
    "乌兹别克斯坦": "Utkir Yusupov|GK,Farrukh Sayfiev|DEF,Abdukodir Khusanov|DEF,Rustam Ashurmatov|DEF,Sherzod Nasrullaev|DEF,Otabek Shukurov|MID,Odiljon Hamrobekov|MID,Jasurbek Jaloliddinov|MID,Eldor Shomurodov|FWD,Igor Sergeev|FWD,Abbostbek Fayzullaev|FWD",
    "南非": "Ronwen Williams|GK,Khuliso Mudau|DEF,Mothobi Mvala|DEF,Siyanda Xulu|DEF,Aubrey Modiba|DEF,Teboho Mokoena|MID,Sphephelo Sithole|MID,Themba Zwane|MID,Percy Tau|FWD,Evidence Makgopa|FWD,Lyle Foster|FWD",
    "民主刚果": "Lionel Mpasi|GK,Gedeon Kalulu|DEF,Chancel Mbemba|DEF,Henock Inonga|DEF,Arthur Masuaku|DEF,Samuel Moutoussamy|MID,Charles Pickel|MID,Theo Bongonda|MID,Yoane Wissa|FWD,Cedric Bakambu|FWD,Silas Katompa Mvumpa|FWD",
    "巴拿马": "Orlando Mosquera|GK,Michael Murillo|DEF,Fidel Escobar|DEF,Andres Andrade|DEF,Eric Davis|DEF,Adalberto Carrasquilla|MID,Anibal Godoy|MID,Cristian Martinez|MID,Edgar Barcenas|FWD,Jose Fajardo|FWD,Ismael Diaz|FWD",
    "约旦": "Yazid Abu Layla|GK,Ehsan Haddad|DEF,Abdallah Nasib|DEF,Yazan Al-Arab|DEF,Mohammad Abu Hashish|DEF,Nizar Al-Rashdan|MID,Rajaei Ayed|MID,Mahmoud Al-Mardi|MID,Mousa Al-Taamari|FWD,Yazan Al-Naimat|FWD,Ali Olwan|FWD",
    "加纳": "Lawrence Ati-Zigi|GK,Alidu Seidu|DEF,Daniel Amartey|DEF,Alexander Djiku|DEF,Gideon Mensah|DEF,Thomas Partey|MID,Mohammed Kudus|MID,Elisha Owusu|MID,Jordan Ayew|FWD,Inaki Williams|FWD,Antoine Semenyo|FWD",
    "波黑": "Ibrahim Sehic|GK,Anel Ahmedhodzic|DEF,Dennis Hadzikadunic|DEF,Sead Kolasinac|DEF,Amar Dedic|DEF,Rade Krunic|MID,Miralem Pjanic|MID,Amir Hadziahmetovic|MID,Edin Dzeko|FWD,Ermedin Demirovic|FWD,Haris Tabakovic|FWD",
    "佛得角": "Vozinha|GK,Steven Moreira|DEF,Logan Costa|DEF,Roberto Lopes|DEF,Joao Paulo Fernandes|DEF,Kevin Pina|MID,Jamiro Monteiro|MID,Kenny Rocha Santos|MID,Garry Rodrigues|FWD,Ryan Mendes|FWD,Bebe|FWD",
    "库拉索": "Eloy Room|GK,Jurien Gaari|DEF,Cuco Martina|DEF,Darryl Lachman|DEF,Sherel Floranus|DEF,Leandro Bacuna|MID,Vurnon Anita|MID,Juninho Bacuna|MID,Brandley Kuwas|FWD,Kenji Gorre|FWD,Rangelo Janga|FWD",
    "海地": "Johny Placide|GK,Carlens Arcus|DEF,Ricardo Ade|DEF,Jean-Kevin Duverne|DEF,Alex Christian|DEF,Bryan Alceus|MID,Derrick Etienne|MID,Danley Jean Jacques|MID,Frantzdy Pierrot|FWD,Duckens Nazon|FWD,Fafa Picault|FWD",
    "新西兰": "Max Crocombe|GK,Tim Payne|DEF,Winston Reid|DEF,Michael Boxall|DEF,Liberato Cacace|DEF,Joe Bell|MID,Marko Stamenic|MID,Matthew Garbett|MID,Chris Wood|FWD,Callum McCowatt|FWD,Elijah Just|FWD"
  };

  Object.entries(compactSquads).forEach(([team, value]) => {
    squads[team] = value.split(",").map((entry, index) => {
      const [name, position] = entry.split("|");
      const number = index === 0 ? 1 : index + 1;
      return [name, name.replaceAll(" ", "_"), number, position, "National Team"];
    });
  });

  function enrich(teamName, row, index) {
    const [name, wiki, number, position, club] = row;
    return {
      name,
      wiki,
      number: Number.isFinite(number) ? number : index + 1,
      position,
      club,
      status: index < 8 ? "主力热区" : "进攻变量",
      rating: (6.8 + ((teamName.length * 17 + index * 13) % 22) / 10).toFixed(1)
    };
  }

  function getSquad(teamName) {
    return (squads[teamName] || []).map((row, index) => enrich(teamName, row, index));
  }

  function groupLineup(teamName) {
    const squad = getSquad(teamName);
    return roleShape.map(([role, count]) => ({
      role,
      players: squad.filter((player) => player.position === role).slice(0, count)
    }));
  }

  function getH2H(aName, bName) {
    const key = [aName, bName].sort().join("|");
    const samples = {
      "巴西|摩洛哥": [
        ["1998", "世界杯小组赛", "巴西 3-0 摩洛哥"],
        ["1997", "友谊赛", "巴西 2-0 摩洛哥"]
      ],
      "法国|塞内加尔": [
        ["2002", "世界杯小组赛", "法国 0-1 塞内加尔"]
      ],
      "德国|日本": [
        ["2022", "世界杯小组赛", "德国 1-2 日本"],
        ["2023", "友谊赛", "德国 1-4 日本"]
      ],
      "西班牙|摩洛哥": [
        ["2022", "世界杯淘汰赛", "摩洛哥 0-0 西班牙"],
        ["2018", "世界杯小组赛", "西班牙 2-2 摩洛哥"]
      ]
    };
    return samples[key] || [];
  }

  return { getSquad, groupLineup, getH2H };
})();

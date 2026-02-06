// Danish Coffee Roasteries Data
// Source: Coffee Roastery Tracker Database

// To make adding website URLs easy, every entry includes a website field.
// Fill in the empty strings with the roastery's site when you have it.
// starred: personal favourite flag | comment: personal tasting note
const roasteriesData = [
    { name: "Aekvator kaffe", region: "Syddanmark", city: "Vejle", website: "https://www.aekvatorkaffe.dk", starred: false, comment: "" },
    { name: "Als Risteri", region: "Syddanmark", city: "S\u00f8nderborg", website: "", starred: false, comment: "" },
    { name: "Amokka", region: "Hovedstaden", city: "Copenhagen", website: "https://amokka.com", starred: false, comment: "" },
    { name: "Andersen & Maillard", region: "Hovedstaden", city: "Copenhagen", website: "https://www.andersenmaillard.dk", starred: false, comment: "" },
    { name: "April Coffee Roasters", region: "Hovedstaden", city: "Copenhagen", website: "https://www.aprilcoffeeroasters.com", starred: true, comment: "Exceptional light roasts, try the Ethiopian single origin" },
    { name: "Berry & Bean", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Buchwalds", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Clever Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Coffee Collective", region: "Hovedstaden", city: "Copenhagen", website: "https://coffeecollective.dk", starred: true, comment: "Pioneers of transparent pricing, consistently great quality" },
    { name: "Copenhagen Coffee Lab", region: "Hovedstaden", city: "Copenhagen", website: "https://copenhagencoffeelab.com", starred: false, comment: "" },
    { name: "Den B\u00e6redygtige B\u00f8nne", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Depanneur", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Dynamo Kaffe", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Emo Fabrik", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Europa Kaffe og Te", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Farm Mountain", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "GarageRisteriet", region: "Syddanmark", city: "Odense", website: "", starred: false, comment: "" },
    { name: "Hedekaffe", region: "Midtjylland", city: "Herning", website: "", starred: false, comment: "" },
    { name: "Hipster Brew", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Holy Bean", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Ideal Kaffe", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Impact Roasters", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Just Coffee", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Kaffeagenterne", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Kaffedepartementet", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Kaffe Lars", region: "Midtjylland", city: "Viborg", website: "", starred: false, comment: "" },
    { name: "Kafferist", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Kaffevaerk", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Kaffe V\u00e6rkstedet", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Kama Kaffe", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Kama Lager", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Kontra Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: true, comment: "Bold and complex blends, great espresso" },
    { name: "LA CABRA", region: "Midtjylland", city: "Aarhus", website: "https://www.lacabra.dk", starred: true, comment: "World-class Nordic roasting, must visit" },
    { name: "Lagom Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Mokkahouse", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Mols Kafferisteri", region: "Midtjylland", city: "Ebeltoft", website: "", starred: false, comment: "" },
    { name: "Nordhavn Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Nord Roastery", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Nordic Coffee House", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Nygaards Kaffe", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Odsherreds Kafferisteri", region: "Sj\u00e6lland", city: "Odsherred", website: "", starred: false, comment: "" },
    { name: "Original Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Prolog Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Risteriet", region: "Hovedstaden", city: "Copenhagen", website: "https://www.risteriet.dk", starred: true, comment: "Classic Copenhagen roastery, lovely caf\u00e9 atmosphere" },
    { name: "Roast Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Soze Kaffe og Risteri", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "Stiller's Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Strandvejsristeriet", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Svendborg Kafferisteri", region: "Syddanmark", city: "Svendborg", website: "", starred: false, comment: "" },
    { name: "Te & Kaffe specialisten", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "Vendia Kaffe", region: "Nordjylland", city: "Vendsyssel", website: "", starred: false, comment: "" },
    { name: "Wingreen Coffee", region: "Hovedstaden", city: "Copenhagen", website: "", starred: false, comment: "" },
    { name: "K\u00f8ge Kafferisteri", region: "Sj\u00e6lland", city: "K\u00f8ge", website: "", starred: false, comment: "" },
    { name: "M\u00f8rk Kaffe", region: "Midtjylland", city: "Aarhus", website: "", starred: false, comment: "" },
    { name: "N\u00f8rre Snede Kafferisteri", region: "Midtjylland", city: "N\u00f8rre Snede", website: "", starred: false, comment: "" }
];

// Region mapping for easier filtering
const regionCities = {
    "Nordjylland": ["Aalborg", "Vendsyssel", "Hj\u00f8rring", "Frederikshavn"],
    "Midtjylland": ["Aarhus", "Viborg", "Randers", "Herning", "Ebeltoft", "N\u00f8rre Snede"],
    "Syddanmark": ["Odense", "Esbjerg", "Kolding", "Vejle", "S\u00f8nderborg", "Svendborg"],
    "Sj\u00e6lland": ["Roskilde", "N\u00e6stved", "K\u00f8ge", "Odsherred"],
    "Hovedstaden": ["Copenhagen", "Helsing\u00f8r", "Hiller\u00f8d"]
};

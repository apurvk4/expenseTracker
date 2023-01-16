const url = new URL("http://localhost:5000/api/listpaidtx");
url.searchParams.set("limit", 5);
url.searchParams.set("skip", 0);
console.log(url.toString());

let app;

function init() {
  navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
    registration.addEventListener('updatefound',function(){
      caches.delete('the-magic-cache');
      window.location.reload(true);
    })
    console.log('Excellent, registered with scope: ', registration.scope);
  });

  app = new Vue({
    el: "#app",
    data: {
      appname: "hathPaisa",
      transactions: [],
      currency: '₹',
      balance: 25000,
      new_amount: 0,
      new_type: '',
      new_comment: '',
      hide_form: true,
      dbOpen: '',
      db: '',
      version: "0.1.0"
    },
    created: function(){
      var total = localStorage.getItem('total')
      if(!total){
        total = 0;
        localStorage.setItem('total',0);
      }
      this.balance = parseInt(total);
      this.dbOpen = indexedDB.open("store", 1);
      
      this.dbOpen.onupgradeneeded = function(){
        app.db = app.dbOpen.result;
        if (!app.db.objectStoreNames.contains('transactions')) { 
          app.db.createObjectStore('transactions', {keyPath: 'id',autoIncrement:true}); 
        }
      }
      this.dbOpen.onsuccess = function(){
        app.db = app.dbOpen.result;
        app.updateTransactions();
      }
      
      
    },
    methods: {
      updateTransactions: async function(){
        var ts = this.db.transaction("transactions","readwrite").objectStore("transactions");
        request = ts.getAll();
        request.onsuccess = function() {
          app.transactions = request.result;
        }
      },
      addTransaction: function(){
        if (this.new_type==""){
          alert("Select transaction type");
          return
        }
        var operation = app.db.transaction("transactions", "readwrite");
        var db_t = operation.objectStore("transactions");
        
        var new_t = {amount:this.new_amount,comment:this.new_comment,type:this.new_type,date:this.today()};
        request = db_t.add(new_t)
        
        request.onsuccess = function(){
          var total = parseInt(localStorage.getItem('total'));
          total += parseInt(app.new_amount);
          localStorage.setItem('total',total);
          app.balance = total;
          app.new_amount = 0;
          app.new_comment = 0;
          app.new_type = "";
          app.hide_form = true;
          app.updateTransactions();
        }
        request.onerror = function(){
          console.log(request.error);
        }
      },
      today: function(){
        var d = new Date();
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
      }
    }
  })
}

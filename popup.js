var exList = []
document.addEventListener('DOMContentLoaded', function() {

  var wrapItem = function(item){
    if(item == 'You have no items in your exclusion list.'){
      return '<li class="list-group-item"><span class="item">' + item + '</span></li>'
    }
    return '<li class="list-group-item"><span class="item">' + item + '</span><a href="#" class="delete" style="float:right;">x</a></li>'
  }
  var createList = function(list){
    var html =''
    list.forEach(function(l){
      html += wrapItem(l)
    });
   return html
  }
  var emptyList = function(){
     $('ul').html(wrapItem('You have no items in your exclusion list.'));
    
    
  }
  var addItem = function(item){

    if(exList.indexOf(item)>-1){return}
    if(exList.length==0){
      $('ul').html("");
    }
    $('ul').append(wrapItem(item));
    exList.push(item)
    saveList();
    $('#term').val("");


  }
  var removeItem = function(element){
      var $li = $(element).parent()
      
      exList.splice(exList.indexOf($li.find('.item').text()),1)
      $li.remove();
      saveList();
      if(exList.length==0){
        emptyList();
      }
  };
  var saveList = function(){
    chrome.storage.sync.set({'exclude': JSON.stringify(exList)}, function() {
        // Notify that we saved.
        //message('Settings saved');
    });
    //localStorage['exclude'] = JSON.stringify(exList)
  };
  // BINDINGS
  $(document).on("click",'.delete', function(event){
      removeItem(event.target);
  });
  $(document).on("keyup",'#term', function(event){
    
      if(event.keyCode == 13){
        addItem($('#term').val())
      }
  });
  
  $('.add').click(function(){
    
    addItem($('#term').val());

    

  });

  // Init 
  var init = function(){
    //console.log(StorageArea)
    
    chrome.storage.sync.get('exclude', function(j){
      if(!j['exclude']){j['exclude']='[]'}
      console.log(j['exclude'])
      exList = JSON.parse(j['exclude'])
      if(exList.length>0){
         $('ul').html(createList(exList));
      }else{
         emptyList();
      }
    })
    
    
   
   
  }


  init();
  
 







}, false);
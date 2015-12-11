var exList = [];
function removeAll(j){
	exList = JSON.parse(j)

	$( "a" ).each(function( i ) {
		var a = this;
		a = $(a);
		if(a.parents('a').length>0){return}
		exList.forEach(function(item){
			item = item.toLowerCase();
			
			if( (a.text() && a.text().toLowerCase().indexOf(item)>-1) || (a.attr('href') && a.attr('href').toLowerCase().indexOf(item)>-1) || (a.attr('title') && a.attr('title').toLowerCase().indexOf(item)>-1)){
				a.attr('old-href',a.attr('href'))
				.attr('old-html',a.html())
				.attr('old-title',a.attr('title'))
				.attr('class','putBackItem')
				.attr('href',"#")
				.html('Blocked link. Click to show.')
				.attr('onclick','function(e){e.preventDefault();}')
				.attr('key',item);
			}
			
		});

	});

}
function getTheData(){
	chrome.storage.sync.get('exclude', function(j){
		removeAll(j['exclude'])

	})

}

$(document).ready(function(){
	
	getTheData();
	
	
	$(document).on('click','.putBackItem',function(event){

		event.preventDefault();
		var a = $(event.target)
		a.removeClass('putBackItem')
		a.attr('href',a.attr('old-href')).html(a.attr('old-html')).attr('title',a.attr('old-title'))
	});


	chrome.storage.onChanged.addListener(function(){
		
		chrome.storage.sync.get('exclude', function(j){
			var newList = JSON.parse(j['exclude'])
			if(newList.length<exList.length){
				var key = ''
				exList.forEach(function(word){
					if(newList.indexOf(word)==-1){
						key = word;
					}
				});

				$('[key="' + key + '"]').each(function(i){
					a = $(this)
					a.removeClass('putBackItem')
					a.attr('href',a.attr('old-href')).html(a.attr('old-html')).attr('title',a.attr('old-title'))			

				});
				exList = newList;
			}else{
				getTheData()		
			}

		})
		

	})
});
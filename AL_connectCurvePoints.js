function AL_connectCurvePoints(){

	//USES OPENHARMONY

	// VARIABLES 
	
	var DOC = $.scn ;
	var INPUT_COLUMN = "";
	var OUTPUT_COLUMN ="";	
	var EXPRESSION_COLUMN = "";
	var CYCLE= 360;
	var LENGTH= 10;
	var avaible_columns = [];
	var avaible_attributes = [];
	
	// EXECUTIONS
	
	MessageLog.trace('test');
	
	var avaible_X_columns = filter_columns_by_type(fetch_X_columns(DOC.selectedNodes),["3DPATH","BEZIER","EASE","QUATERNIONPATH"]);
	var avaible_Y_columns = filter_columns_by_type(fetch_Y_columns(DOC.selectedNodes),["3DPATH","BEZIER","EASE","QUATERNIONPATH"]);
	
	var select_column_listX =[]
	var select_column_listY= []
	
	for(var n = 0 ; n < avaible_X_columns.length; n++){ 
	
		select_column_listX.push(avaible_X_columns[n].node+" --> "+avaible_X_columns[n].display_name);
	
	}

	for(var n = 0 ; n < avaible_Y_columns.length; n++){ 
	
		select_column_listY.push(avaible_Y_columns[n].node+" --> "+avaible_Y_columns[n].display_name);
	
	}
	
	
	InputDialog ()
	


	// FUNCTIONS 
	

	function InputDialog (){
		
		//MessageLog.trace(arguments.callee.name)
	    var d = new Dialog
	    d.title = "MODULO MASTER";
	    d.width = 100;

		var INPUTX = new ComboBox();
		 INPUTX.label = "SOURCE X  : ";
		 INPUTX.editable = true;
		 INPUTX.itemList = select_column_listX;
		d.add(INPUTX);
			
		var INPUTY = new ComboBox();
		 INPUTY.label = "SOURCE Y  : ";
		 INPUTY.editable = true;
		 INPUTY.itemList = select_column_listY;
		d.add(INPUTY);		
		
		if ( d.exec() ){	
		
			var selected_column_index_X = select_column_listX.indexOf(INPUTX.currentItem);
			var selected_column_index_Y = select_column_listY.indexOf(INPUTY.currentItem);

			var INPUT_COLUMN_X = avaible_X_columns[selected_column_index_X];
			var INPUT_COLUMN_Y = avaible_X_columns[selected_column_index_Y];
	
			MessageLog.trace("INPUT_COLUMN");
			MessageLog.trace(INPUT_COLUMN_X.display);
			MessageLog.trace(INPUT_COLUMN_Y.display);
			
			var source_column_x = INPUT_COLUMN_X.name
			var source_column_y = INPUT_COLUMN_Y.name
			
			for(var i = 1 ; i < DOC.selectedNodes.length ; i++){
				node.linkAttr(DOC.selectedNodes[i].path, "offset.X", source_column_x);	
				node.linkAttr(DOC.selectedNodes[i].path, "offset.Y", source_column_y);	
				
			}

		}
		
	}

	function fetch_X_columns(nodes_list){
		
		var columns_list = Array();
		
		for(var n = 0 ; n < nodes_list.length; n++){ 
		
			var currentNode = nodes_list[n];
			
			var linked_columns = get_linked_X_columns(currentNode);
			
			if(linked_columns.length >0){
				
				columns_list = columns_list.concat(linked_columns);
			}
		}
		
		
		return unique_array(columns_list); 
		
	}		
	function fetch_Y_columns(nodes_list){
		
		var columns_list = Array();
		
		for(var n = 0 ; n < nodes_list.length; n++){ 
		
			var currentNode = nodes_list[n];
			
			var linked_columns = get_linked_Y_columns(currentNode);
			
			if(linked_columns.length >0){
				
				columns_list = columns_list.concat(linked_columns);
			}
		}
		
		
		return unique_array(columns_list); 
		
	}			
	
	
	function get_linked_Y_columns(_node){
		
		var node_columns = Array();
	
		var attrList = getAttributesNameList(_node);
		
		for (var i=0; i<attrList.length; i++){
			
			var attribute_name = attrList[i]
			
			if(attribute_name == "offset.Y"){
				
				var linked_column = node.linkedColumn(_node,attribute_name)
				
				
				if( linked_column !=""){
					
					var linked_column_name = column.getDisplayName(linked_column);

					//node_columns.push(linked_column_name);
					var C = {node:_node,name:linked_column,display_name:linked_column_name}
					node_columns.push(C);
				}				
				
			}
			

			
		}
		
		return node_columns;
		
		
	}
	
	
	function get_linked_X_columns(_node){
		
		var node_columns = Array();
	
		var attrList = getAttributesNameList(_node);
		
		for (var i=0; i<attrList.length; i++){
			
			var attribute_name = attrList[i]
			
			if(attribute_name == "offset.X"){
				
				var linked_column = node.linkedColumn(_node,attribute_name)
				
				
				if( linked_column !=""){
					
					var linked_column_name = column.getDisplayName(linked_column);

					//node_columns.push(linked_column_name);
					var C = {node:_node,name:linked_column,display_name:linked_column_name}
					node_columns.push(C);
				}				
				
			}
			

			
		}
		
		return node_columns;
		
	}	
	
	
	function unique_array(arr){
		
		var unique_array = Array();
		for(var i = 0 ; i<arr.length;i++){
			if(unique_array.indexOf(arr[i])==-1){
				unique_array.push(arr[i]);
			}
		}
		return unique_array;
		
	}
	
	function get_attributes_and_nodes(nodes_list){
		
		var attributes_and_nodes = []
		
		for(var n = 0 ; n < nodes_list.length; n++){ 
		
			var currentNode = nodes_list[n];	
			var attr_list = getAttributesNameList(currentNode);
			
			for (var i=0; i<attr_list.length; i++){	
			
				var attr = node.getAttr(currentNode, 1, attr_list[i]);
				var attr_type = attr.typeName();
				
				if(attr_type  == "DOUBLE" || attr_type  == "DOUBLEVB" ){
					
					var AN = {node:currentNode,name:attr_list[i]};
					
					MessageLog.trace(attr_type)
					
					attributes_and_nodes.push(AN);				
					
				}
				
			}
		}
		
		return attributes_and_nodes;
	}
	
	function getAttributesNameList (snode){
		
		//MessageLog.trace(arguments.callee.name)
		
		var attrList = node.getAttrList(snode, frame.current(),"");
		var name_list= Array();
		
		for (var i=0; i<attrList.length; i++){	

			var attr = attrList[i];
			var a_name = attr.keyword();
			var sub_attr = attr.getSubAttributes()
			name_list.push(a_name);

			if(sub_attr.length > 0){
				for (var j=0; j<sub_attr.length; j++){	
					attrList.push(sub_attr[j]);
					var sub_attr_name = sub_attr[j].fullKeyword()
					name_list.push(sub_attr_name);
				}
			}
			
		}
		
		//MessageLog.trace(name_list)
		
		return name_list;
		
	}
	function filter_columns_by_type (column_list,relevant_types){
		
		//MessageLog.trace(arguments.callee.name)
		
		var filtered_list = Array();
		
		for(var i = 0 ; i<column_list.length;i++){
			
				if(relevant_types.indexOf(column.type(column_list[i].name))!=-1){
					
					filtered_list.push(column_list[i])
					
					//MessageLog.trace(column.type(column_list[i]));
					
				}
		}
		
		return filtered_list;
	}
	


}

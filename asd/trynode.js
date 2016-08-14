var fs = require('fs')
//var sleep = require('sleep');
var Promise = require('bluebird')
Promise.promisifyAll(fs);
old_path = 'test'

//        using callbacks      //

// create_nfiles(4, ()=>{delete_nfiles(old_path)})


// function create_nfiles(n, callback) {
//     i = 0;
//     x = n;
//     while (i < 4) {
//             i ++;
//             name = old_path + i + ".txt"
//             console.log(name)
//             fs.writeFile(name, "here1" + i, (err) => {
//                 if (err) { console.log(err); }
//                 console.log(name + " created!");
//                 x--;
//                 if (x == 0) {
//                     callback();
//                 }
//             })

//     }

// }

// function delete_nfiles(old_path) {
//     i = 0;
//     x = 4;
// flag = true;
//     while (i < 4) {
       
//         i++;
//         name = old_path + i + ".txt"
//         if (flag)
//              uname = name + x;
        
//         flag =  false 
//         console.log("here we SHOULD delete "+name )
//             fs.unlink(name, (err) => {
//                 if (err) console.log(err);
//                 flag = true
//                 x--;
//                 console.log(uname + " deleted!");
//             });
    
//     }
// }

//    using promises    //
old_name = 'test';
id = 0;
new_name = old_name + id;
id++;
fs.writeFileAsync(new_name, new_name).then(create_file_with_new_name).then(create_file_with_new_name).then(create_file_with_new_name).done(deleteall_files)

 a = create_file_with_new_name()
 console.log(a)

function create_file_with_new_name() {
    new_name = old_name + id;
    id++;
    return fs.writeFileAsync(new_name, new_name).then(console.log(new_name + " created??")) , 2
}


function reset_ids() {
    id = 0;
}

function deleteall_files() {
    reset_ids()
    while (id < 4) {
        new_name = old_name + id;
        id++;
        fs.unlink(new_name)
        console.log(new_name + " Deleted !")
    }
}

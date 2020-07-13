ClassicEditor
    .create(document.getElementById("text-editor"), {
        "removePlugins": ["ImageUpload", "MediaEmbed"]
    })
    .then(function(editor) {
        console.log(editor)
        editor.model.document.on("change:data", function() {
            var input = document.getElementById("post-input");
            input.value = editor.getData();
        })
    })
    .catch(function(err) {
        console.log("error", err)
    });

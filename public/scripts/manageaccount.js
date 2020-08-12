function deleteAccount() {
    if (window.confirm("Do you want to delete your account? This action cannot be undone.")) {
        document.getElementById("deleteForm").submit();
    }
}
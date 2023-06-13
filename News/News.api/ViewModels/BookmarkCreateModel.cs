namespace News.api.ViewModels
{
    public class BookmarkCreateModel
    {
        public string? UserID { get; set; }
        public string? EventsID { get; set; }
    }
    public class BookmarkUpdate : BookmarkCreateModel 
    {
        public string? EventsID { get; set; }
    }
}


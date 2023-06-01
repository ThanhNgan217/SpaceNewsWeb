namespace News.api.ViewModels
{
    public class GroupMemberCreateModel
    {
        public int? MemberID { get; set; }
        public int? GroupID { get; set; }

    }
    public class GroupMemberUpdateModel : GroupMemberCreateModel
    {
        public int Id { get; set; }
    }
}
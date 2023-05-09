﻿using System.Text.Json.Serialization;

namespace News.api.Entities;

public class Topic
{
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<Post> Posts { get; set; }
}

public class Post
{
    public int Id { get; set; }
    public DateTime? Date { get; set; }
    public DateTime? Time { get; set; }
    public string? Location { get; set; }
    public int Priority { get; set; }
    public string Image { get; set; }
    public string Content { get; set; }
    public bool ShowInSlider { get; set; }
    public int? TopicID { get; set; }

    public int? GroupID { get; set; }
    public string? Title { get; set; }
    public string? Type { get; set; }

    [JsonIgnore]
    public virtual Topic? Topic { get; set; }
    public virtual Group? Group { get; set; }
}

public class Group
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string? Email { get; set; }

}
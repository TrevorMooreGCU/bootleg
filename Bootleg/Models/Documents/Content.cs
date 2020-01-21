﻿using Bootleg.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Bootleg.Models.Documents
{
	public class Content
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		[BsonRequired]
		public string UserId { get; set; }
		public string DatePostedUTC { get; set; }
		[Required]
		[BsonRequired]
		[StringLength(200, MinimumLength = 1, ErrorMessage = "Content body must have a minimum of 1 character, and a max of 200.")]
		public string ContentBody { get; set; }
		public string MediaUri { get; set; }
		public string BlobReference { get; set; }
		public MediaType MediaType { get; set; }
		public int Likes { get; set; }
		public int Dislikes { get; set; }
		public List<Content> Comments { get; set; }
	}
}
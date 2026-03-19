import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

actor {
  type Post = {
    id : Nat;
    author : Principal;
    title : Text;
    description : Text;
    externalLink : ?Text;
    timestamp : Nat;
  };

  module Post {
    public func compare(a : Post, b : Post) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Persistent state
  let posts = Map.empty<Nat, Post>();
  var nextPostId = 0;

  let forbiddenKeywords = List.fromArray(["sex", "nude", "porn", "explicit", "xxx", "hardcore", "fetish", "erotic"]);

  // Helper function to filter content
  func containsForbiddenKeyword(text : Text) : Bool {
    switch (forbiddenKeywords.find(func(keyword) { text.contains(#text keyword) })) {
      case (?_) { true };
      case (null) { false };
    };
  };

  public type PostInput = {
    title : Text;
    description : Text;
    externalLink : ?Text;
  };

  public shared ({ caller }) func createPost(input : PostInput) : async () {
    // Perform content check
    if (containsForbiddenKeyword(input.title) or containsForbiddenKeyword(input.description)) {
      Runtime.trap("Content violates policy. Explicit keywords are not allowed!");
    };

    let post : Post = {
      id = nextPostId;
      author = caller;
      title = input.title;
      description = input.description;
      externalLink = input.externalLink;
      timestamp = nextPostId;
    };

    posts.add(nextPostId, post);
    nextPostId += 1;
  };

  public query ({ caller }) func listPosts(limit : Nat) : async [Post] {
    posts.values().toArray().sliceToArray(0, Nat.min(limit, posts.size()));
  };

  public query ({ caller }) func getPost(id : Nat) : async Post {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        if (post.author != caller) {
          Runtime.trap("Unauthorized delete attempt. You are not the author.");
        };
        posts.remove(id);
      };
    };
  };

  public query ({ caller }) func ageGate(ageConfirmed : Bool) : async () {
    if (not ageConfirmed) {
      Runtime.trap("Age confirmation required to access content.");
    };
  };
};

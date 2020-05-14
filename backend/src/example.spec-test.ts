// feature
class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    global.console.log(`Friend is added: ${name}`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error(`Friend wasn't found`);
    }

    this.friends.splice(idx, 1);
  }
}

// test
describe('FriendsList', () => {
  let fl: FriendsList;

  beforeEach(() => {
    fl = new FriendsList();
  });

  it('should init', () => {
    expect(fl.friends.length).toEqual(0);
  });

  it('add a friend', () => {
    fl.addFriend('Alice');
    expect(fl.friends.length).toEqual(1);
  });

  it('announce friendship', () => {
    fl.announceFriendship = jest.fn();
    expect(fl.announceFriendship).not.toHaveBeenCalled();
    fl.addFriend('Alice');
    expect(fl.announceFriendship).toHaveBeenCalledWith('Alice');
  });

  describe('removeFriend', () => {
    it('should remove a friend by name', () => {
      fl.addFriend('Alice');
      expect(fl.friends[0]).toEqual('Alice');
      fl.removeFriend('Alice');
      expect(fl.friends[0]).toBeUndefined();
    });

    it('throws an error as friend does not exist', () => {
      expect(() => fl.removeFriend('Mike')).toThrow(new Error(`Friend wasn't found`));
    });
  });
});
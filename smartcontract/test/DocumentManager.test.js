const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentManager", function () {
  let documentManager;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const DocumentManager = await ethers.getContractFactory("DocumentManager");
    documentManager = await DocumentManager.deploy();
    await documentManager.waitForDeployment();
  });

  describe("Document Upload", function () {
    it("Should upload a document successfully", async function () {
      const docHash = "QmTestHash123";
      const title = "Test Document";
      const description = "A test document for testing purposes";

      const tx = await documentManager
        .connect(user1)
        .uploadDocument(docHash, title, description);
      const receipt = await tx.wait();

      // Check event emission
      const event = receipt.logs.find((log) => {
        try {
          const parsed = documentManager.interface.parseLog(log);
          return parsed.name === "DocumentUploaded";
        } catch {
          return false;
        }
      });
      expect(event).to.not.be.undefined;
      const parsedEvent = documentManager.interface.parseLog(event);
      expect(parsedEvent.args.documentId).to.equal(1);
      expect(parsedEvent.args.owner).to.equal(user1.address);
      expect(parsedEvent.args.docHash).to.equal(docHash);
      expect(parsedEvent.args.title).to.equal(title);

      // Check document storage
      const document = await documentManager.getDocument(1);
      expect(document.docHash).to.equal(docHash);
      expect(document.title).to.equal(title);
      expect(document.description).to.equal(description);
      expect(document.owner).to.equal(user1.address);
    });

    it("Should reject empty document hash", async function () {
      await expect(
        documentManager
          .connect(user1)
          .uploadDocument("", "Title", "Description")
      ).to.be.revertedWith("Document hash cannot be empty");
    });

    it("Should reject empty title", async function () {
      await expect(
        documentManager
          .connect(user1)
          .uploadDocument("QmHash", "", "Description")
      ).to.be.revertedWith("Title cannot be empty");
    });
  });

  describe("Document Permissions", function () {
    beforeEach(async function () {
      // Upload a document first
      await documentManager
        .connect(user1)
        .uploadDocument("QmHash1", "Title1", "Description1");
    });

    it("Should grant permission successfully", async function () {
      const tx = await documentManager
        .connect(user1)
        .grantPermission(1, user2.address);
      const receipt = await tx.wait();

      // Check event emission
      const event = receipt.logs.find((log) => {
        try {
          const parsed = documentManager.interface.parseLog(log);
          return parsed.name === "DocumentShared";
        } catch {
          return false;
        }
      });
      expect(event).to.not.be.undefined;
      const parsedEvent = documentManager.interface.parseLog(event);
      expect(parsedEvent.args.documentId).to.equal(1);
      expect(parsedEvent.args.from).to.equal(user1.address);
      expect(parsedEvent.args.to).to.equal(user2.address);

      // Check permission
      const hasPermission = await documentManager.hasPermission(
        1,
        user2.address
      );
      expect(hasPermission).to.be.true;
    });

    it("Should revoke permission successfully", async function () {
      // First grant permission
      await documentManager.connect(user1).grantPermission(1, user2.address);

      // Then revoke it
      const tx = await documentManager
        .connect(user1)
        .revokePermission(1, user2.address);
      const receipt = await tx.wait();

      // Check event emission
      const event = receipt.logs.find((log) => {
        try {
          const parsed = documentManager.interface.parseLog(log);
          return parsed.name === "PermissionRevoked";
        } catch {
          return false;
        }
      });
      expect(event).to.not.be.undefined;
      const parsedEvent = documentManager.interface.parseLog(event);
      expect(parsedEvent.args.documentId).to.equal(1);
      expect(parsedEvent.args.from).to.equal(user1.address);
      expect(parsedEvent.args.to).to.equal(user2.address);

      // Check permission is revoked
      const hasPermission = await documentManager.hasPermission(
        1,
        user2.address
      );
      expect(hasPermission).to.be.false;
    });

    it("Should reject permission grant from non-owner", async function () {
      await expect(
        documentManager.connect(user2).grantPermission(1, user3.address)
      ).to.be.revertedWith("Only document owner can perform this action");
    });

    it("Should reject permission grant to zero address", async function () {
      await expect(
        documentManager.connect(user1).grantPermission(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Cannot grant permission to zero address");
    });
  });

  describe("Document Queries", function () {
    beforeEach(async function () {
      // Upload multiple documents
      await documentManager
        .connect(user1)
        .uploadDocument("QmHash1", "Title1", "Description1");
      await documentManager
        .connect(user1)
        .uploadDocument("QmHash2", "Title2", "Description2");
      await documentManager
        .connect(user2)
        .uploadDocument("QmHash3", "Title3", "Description3");

      // Share document 1 with user2
      await documentManager.connect(user1).grantPermission(1, user2.address);
    });

    it("Should return user's documents", async function () {
      const myDocuments = await documentManager.connect(user1).getMyDocuments();
      expect(myDocuments).to.have.lengthOf(2);
      expect(myDocuments[0]).to.equal(1);
      expect(myDocuments[1]).to.equal(2);
    });

    it("Should return shared documents", async function () {
      const sharedDocuments = await documentManager
        .connect(user2)
        .getSharedDocuments();
      expect(sharedDocuments).to.have.lengthOf(1);
      expect(sharedDocuments[0]).to.equal(1);
    });

    it("Should check permission correctly", async function () {
      const hasPermission1 = await documentManager.hasPermission(
        1,
        user1.address
      );
      const hasPermission2 = await documentManager.hasPermission(
        1,
        user2.address
      );
      const hasPermission3 = await documentManager.hasPermission(
        1,
        user3.address
      );

      expect(hasPermission1).to.be.true; // Owner
      expect(hasPermission2).to.be.true; // Has permission
      expect(hasPermission3).to.be.false; // No permission
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      await documentManager
        .connect(user1)
        .uploadDocument("QmHash1", "Title1", "Description1");
    });

    it("Should transfer ownership successfully", async function () {
      const tx = await documentManager
        .connect(user1)
        .transferOwnership(1, user2.address);
      const receipt = await tx.wait();

      // Check event emission
      const event = receipt.logs.find((log) => {
        try {
          const parsed = documentManager.interface.parseLog(log);
          return parsed.name === "OwnershipTransferred";
        } catch {
          return false;
        }
      });
      expect(event).to.not.be.undefined;
      const parsedEvent = documentManager.interface.parseLog(event);
      expect(parsedEvent.args.documentId).to.equal(1);
      expect(parsedEvent.args.from).to.equal(user1.address);
      expect(parsedEvent.args.to).to.equal(user2.address);

      // Check new owner
      const document = await documentManager.getDocument(1);
      expect(document.owner).to.equal(user2.address);
    });

    it("Should reject transfer from non-owner", async function () {
      await expect(
        documentManager.connect(user2).transferOwnership(1, user3.address)
      ).to.be.revertedWith("Only document owner can perform this action");
    });
  });
});
